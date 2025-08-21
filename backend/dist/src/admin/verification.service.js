"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendingVerifications() {
        const pendingDocuments = await this.prisma.verificationDocument.findMany({
            where: { status: shared_1.VerificationDocumentStatus.PENDING },
            include: {
                cleaner: {
                    include: {
                        user: true,
                        services: {
                            include: {
                                service: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        const groupedByCleaners = pendingDocuments.reduce((acc, doc) => {
            const cleanerId = doc.cleanerUserId;
            if (!acc[cleanerId]) {
                acc[cleanerId] = {
                    cleaner: doc.cleaner,
                    documents: [],
                    totalDocuments: 0,
                };
            }
            acc[cleanerId].documents.push(doc);
            acc[cleanerId].totalDocuments++;
            return acc;
        }, {});
        return Object.values(groupedByCleaners);
    }
    async getCleanerVerificationStatus(cleanerUserId) {
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId: cleanerUserId },
            include: {
                user: true,
                verificationDocuments: {
                    orderBy: { createdAt: 'desc' },
                },
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner not found');
        }
        const documents = cleaner.verificationDocuments;
        const approvedDocs = documents.filter(doc => doc.status === shared_1.VerificationDocumentStatus.APPROVED);
        const rejectedDocs = documents.filter(doc => doc.status === shared_1.VerificationDocumentStatus.REJECTED);
        const pendingDocs = documents.filter(doc => doc.status === shared_1.VerificationDocumentStatus.PENDING);
        const requiredDocTypes = ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'];
        const hasAllRequired = requiredDocTypes.every(type => approvedDocs.some(doc => doc.type === type));
        return {
            cleaner,
            verificationStatus: {
                isVerified: cleaner.isVerified,
                hasAllRequiredDocuments: hasAllRequired,
                documentsCount: {
                    total: documents.length,
                    approved: approvedDocs.length,
                    rejected: rejectedDocs.length,
                    pending: pendingDocs.length,
                },
                requiredDocuments: requiredDocTypes.map(type => ({
                    type,
                    status: documents.find(doc => doc.type === type)?.status || 'MISSING',
                    document: documents.find(doc => doc.type === type),
                })),
            },
            documents: documents,
        };
    }
    async reviewVerificationDocument(documentId, adminUserId, status, reason) {
        const document = await this.prisma.verificationDocument.findUnique({
            where: { id: documentId },
            include: {
                cleaner: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Verification document not found');
        }
        if (document.status !== shared_1.VerificationDocumentStatus.PENDING) {
            throw new common_1.BadRequestException('Document has already been reviewed');
        }
        const updatedDocument = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
            const updated = await tx.verificationDocument.update({
                where: { id: documentId },
                data: {
                    status,
                    reviewedBy: adminUserId,
                    reviewedAt: new Date(),
                },
                include: {
                    cleaner: true,
                    reviewer: {
                        include: {
                            clientProfile: true,
                        },
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: adminUserId,
                    action: 'DOCUMENT_REVIEWED',
                    entity: 'verification_document',
                    entityId: documentId,
                    meta: {
                        cleanerUserId: document.cleanerUserId,
                        documentType: document.type,
                        reviewStatus: status,
                        reason,
                    },
                },
            });
            return updated;
        });
        await this.checkCleanerVerificationStatus(document.cleanerUserId, adminUserId);
        return updatedDocument;
    }
    async verifyCleaner(cleanerUserId, adminUserId, verified, reason) {
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId: cleanerUserId },
            include: {
                user: true,
                verificationDocuments: true,
            },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner not found');
        }
        const updatedCleaner = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
            const updated = await tx.cleanerProfile.update({
                where: { userId: cleanerUserId },
                data: { isVerified: verified },
                include: {
                    user: true,
                    verificationDocuments: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: adminUserId,
                    action: verified ? 'CLEANER_VERIFIED' : 'CLEANER_UNVERIFIED',
                    entity: 'cleaner_profile',
                    entityId: cleanerUserId,
                    meta: {
                        verified,
                        reason,
                        businessName: cleaner.businessName,
                    },
                },
            });
            return updated;
        });
        return updatedCleaner;
    }
    async getVerificationStatistics() {
        const [totalCleaners, verifiedCleaners, pendingVerifications, rejectedCleaners, documentsCount, recentVerifications,] = await Promise.all([
            this.prisma.cleanerProfile.count(),
            this.prisma.cleanerProfile.count({
                where: { isVerified: true },
            }),
            this.prisma.verificationDocument.count({
                where: { status: shared_1.VerificationDocumentStatus.PENDING },
            }),
            this.prisma.cleanerProfile.count({
                where: {
                    isVerified: false,
                    verificationDocuments: {
                        some: {
                            status: shared_1.VerificationDocumentStatus.REJECTED,
                        },
                    },
                },
            }),
            this.prisma.verificationDocument.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            this.prisma.verificationDocument.findMany({
                where: {
                    status: { not: shared_1.VerificationDocumentStatus.PENDING },
                    reviewedAt: { not: null },
                },
                include: {
                    cleaner: {
                        include: {
                            user: true,
                        },
                    },
                    reviewer: {
                        include: {
                            clientProfile: true,
                        },
                    },
                },
                orderBy: { reviewedAt: 'desc' },
                take: 10,
            }),
        ]);
        return {
            totalCleaners,
            verifiedCleaners,
            pendingVerifications,
            rejectedCleaners,
            verificationRate: totalCleaners > 0 ? (verifiedCleaners / totalCleaners) * 100 : 0,
            documentsCount,
            recentVerifications,
        };
    }
    async checkCleanerVerificationStatus(cleanerUserId, adminUserId) {
        const documents = await this.prisma.verificationDocument.findMany({
            where: { cleanerUserId },
        });
        const requiredTypes = ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'];
        const hasAllApproved = requiredTypes.every(type => documents.some(doc => doc.type === type && doc.status === shared_1.VerificationDocumentStatus.APPROVED));
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId: cleanerUserId },
        });
        if (hasAllApproved && !cleaner?.isVerified) {
            await this.verifyCleaner(cleanerUserId, adminUserId, true, 'Auto-verified: All required documents approved');
        }
        else if (!hasAllApproved && cleaner?.isVerified) {
            await this.verifyCleaner(cleanerUserId, adminUserId, false, 'Auto-unverified: Required document rejected');
        }
    }
    async bulkVerifyCleaners(cleanerIds, adminUserId, verified, reason) {
        const results = [];
        for (const cleanerId of cleanerIds) {
            try {
                const result = await this.verifyCleaner(cleanerId, adminUserId, verified, reason);
                results.push({ cleanerId, success: true, cleaner: result });
            }
            catch (error) {
                results.push({ cleanerId, success: false, error: error.message });
            }
        }
        return {
            processed: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results,
        };
    }
    async getVerificationMetrics(dateFrom, dateTo) {
        const whereClause = {};
        if (dateFrom || dateTo) {
            whereClause.reviewedAt = {};
            if (dateFrom)
                whereClause.reviewedAt.gte = dateFrom;
            if (dateTo)
                whereClause.reviewedAt.lte = dateTo;
        }
        const verificationTrends = await this.prisma.verificationDocument.groupBy({
            by: ['status'],
            where: { ...whereClause, reviewedAt: { not: null } },
            _count: { status: true },
        });
        const dailyVerifications = await this.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC('day', reviewed_at) as date,
        status,
        COUNT(*) as count
      FROM verification_documents 
      WHERE reviewed_at IS NOT NULL
        ${dateFrom ? `AND reviewed_at >= ${dateFrom}` : ''}
        ${dateTo ? `AND reviewed_at <= ${dateTo}` : ''}
      GROUP BY DATE_TRUNC('day', reviewed_at), status
      ORDER BY date DESC
      LIMIT 30
    `;
        return {
            verificationTrends,
            dailyVerifications,
        };
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map