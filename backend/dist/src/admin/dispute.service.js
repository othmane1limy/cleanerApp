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
exports.DisputeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
let DisputeService = class DisputeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDispute(bookingId, userId, reason) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: {
                    include: {
                        clientProfile: true,
                    },
                },
                cleaner: {
                    include: {
                        cleanerProfile: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientUserId !== userId && booking.cleanerUserId !== userId) {
            throw new common_1.ForbiddenException('Only booking participants can create disputes');
        }
        const existingDispute = await this.prisma.dispute.findFirst({
            where: { bookingId },
        });
        if (existingDispute) {
            throw new common_1.BadRequestException('Dispute already exists for this booking');
        }
        const dispute = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            const newDispute = await tx.dispute.create({
                data: {
                    bookingId,
                    openedByUserId: userId,
                    reason,
                    status: shared_1.DisputeStatus.OPEN,
                },
                include: {
                    booking: {
                        include: {
                            client: {
                                include: {
                                    clientProfile: true,
                                },
                            },
                            cleaner: {
                                include: {
                                    cleanerProfile: true,
                                },
                            },
                            cleanerService: {
                                include: {
                                    service: true,
                                },
                            },
                        },
                    },
                    openedBy: {
                        include: {
                            clientProfile: true,
                            cleanerProfile: true,
                        },
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: userId,
                    action: 'DISPUTE_CREATED',
                    entity: 'dispute',
                    entityId: newDispute.id,
                    meta: {
                        bookingId,
                        reason,
                        openedByRole: booking.clientUserId === userId ? 'CLIENT' : 'CLEANER',
                    },
                },
            });
            return newDispute;
        });
        return dispute;
    }
    async getDisputes(filters) {
        let whereClause = {};
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.createdAt = {};
            if (filters.dateFrom)
                whereClause.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                whereClause.createdAt.lte = new Date(filters.dateTo);
        }
        const disputes = await this.prisma.dispute.findMany({
            where: whereClause,
            include: {
                booking: {
                    include: {
                        client: {
                            include: {
                                clientProfile: true,
                            },
                        },
                        cleaner: {
                            include: {
                                cleanerProfile: true,
                            },
                        },
                        cleanerService: {
                            include: {
                                service: true,
                            },
                        },
                    },
                },
                openedBy: {
                    include: {
                        clientProfile: true,
                        cleanerProfile: true,
                    },
                },
                resolver: {
                    include: {
                        clientProfile: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: filters?.limit || 50,
            skip: filters?.offset || 0,
        });
        return disputes;
    }
    async getDisputeById(disputeId) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: {
                booking: {
                    include: {
                        client: {
                            include: {
                                clientProfile: true,
                            },
                        },
                        cleaner: {
                            include: {
                                cleanerProfile: true,
                            },
                        },
                        cleanerService: {
                            include: {
                                service: true,
                            },
                        },
                        events: {
                            include: {
                                actor: {
                                    include: {
                                        clientProfile: true,
                                        cleanerProfile: true,
                                    },
                                },
                            },
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                },
                openedBy: {
                    include: {
                        clientProfile: true,
                        cleanerProfile: true,
                    },
                },
                resolver: {
                    include: {
                        clientProfile: true,
                    },
                },
            },
        });
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        return dispute;
    }
    async resolveDispute(disputeId, adminUserId, status, resolutionNote) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: {
                booking: true,
            },
        });
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        if (dispute.status === shared_1.DisputeStatus.RESOLVED || dispute.status === shared_1.DisputeStatus.REJECTED) {
            throw new common_1.BadRequestException('Dispute has already been resolved');
        }
        const resolvedDispute = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
            const updated = await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status,
                    resolvedBy: adminUserId,
                    resolvedAt: new Date(),
                    resolutionNote,
                },
                include: {
                    booking: {
                        include: {
                            client: {
                                include: {
                                    clientProfile: true,
                                },
                            },
                            cleaner: {
                                include: {
                                    cleanerProfile: true,
                                },
                            },
                        },
                    },
                    openedBy: {
                        include: {
                            clientProfile: true,
                            cleanerProfile: true,
                        },
                    },
                    resolver: {
                        include: {
                            clientProfile: true,
                        },
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: adminUserId,
                    action: 'DISPUTE_RESOLVED',
                    entity: 'dispute',
                    entityId: disputeId,
                    meta: {
                        bookingId: dispute.bookingId,
                        resolution: status,
                        resolutionNote,
                        openedBy: dispute.openedByUserId,
                    },
                },
            });
            return updated;
        });
        return resolvedDispute;
    }
    async updateDisputeStatus(disputeId, adminUserId, status, note) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
        });
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        const updatedDispute = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
            const updated = await tx.dispute.update({
                where: { id: disputeId },
                data: { status },
            });
            await tx.auditLog.create({
                data: {
                    actorUserId: adminUserId,
                    action: 'DISPUTE_STATUS_UPDATED',
                    entity: 'dispute',
                    entityId: disputeId,
                    meta: {
                        oldStatus: dispute.status,
                        newStatus: status,
                        note,
                    },
                },
            });
            return updated;
        });
        return updatedDispute;
    }
    async getDisputeStatistics() {
        const [totalDisputes, openDisputes, resolvedDisputes, rejectedDisputes, disputesByStatus, recentDisputes, avgResolutionTime,] = await Promise.all([
            this.prisma.dispute.count(),
            this.prisma.dispute.count({
                where: { status: shared_1.DisputeStatus.OPEN },
            }),
            this.prisma.dispute.count({
                where: { status: shared_1.DisputeStatus.RESOLVED },
            }),
            this.prisma.dispute.count({
                where: { status: shared_1.DisputeStatus.REJECTED },
            }),
            this.prisma.dispute.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            this.prisma.dispute.findMany({
                include: {
                    booking: {
                        include: {
                            cleanerService: {
                                include: {
                                    service: true,
                                },
                            },
                        },
                    },
                    openedBy: {
                        include: {
                            clientProfile: true,
                            cleanerProfile: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.$queryRaw `
        SELECT AVG(
          EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
        ) as avg_hours
        FROM disputes 
        WHERE resolved_at IS NOT NULL
      `,
        ]);
        return {
            totalDisputes,
            openDisputes,
            resolvedDisputes,
            rejectedDisputes,
            resolutionRate: totalDisputes > 0 ? (resolvedDisputes / totalDisputes) * 100 : 0,
            disputesByStatus,
            recentDisputes,
            avgResolutionTimeHours: avgResolutionTime[0]?.avg_hours || 0,
        };
    }
    async getDisputeTrends(dateFrom, dateTo) {
        const whereClause = {};
        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom)
                whereClause.createdAt.gte = dateFrom;
            if (dateTo)
                whereClause.createdAt.lte = dateTo;
        }
        const dailyDisputes = await this.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as disputes_created,
        COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) as disputes_resolved
      FROM disputes 
      WHERE true
        ${dateFrom ? `AND created_at >= ${dateFrom}` : ''}
        ${dateTo ? `AND created_at <= ${dateTo}` : ''}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
        return { dailyDisputes };
    }
};
exports.DisputeService = DisputeService;
exports.DisputeService = DisputeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisputeService);
//# sourceMappingURL=dispute.service.js.map