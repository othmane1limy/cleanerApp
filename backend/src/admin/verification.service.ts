import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationDocumentStatus } from '@cleaning-marketplace/shared';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // Cleaner Verification Management
  // ======================

  async getPendingVerifications() {
    const pendingDocuments = await this.prisma.verificationDocument.findMany({
      where: { status: VerificationDocumentStatus.PENDING },
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

    // Group by cleaner
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
    }, {} as any);

    return Object.values(groupedByCleaners);
  }

  async getCleanerVerificationStatus(cleanerUserId: string) {
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
      throw new NotFoundException('Cleaner not found');
    }

    const documents = cleaner.verificationDocuments;
    const approvedDocs = documents.filter(doc => doc.status === VerificationDocumentStatus.APPROVED);
    const rejectedDocs = documents.filter(doc => doc.status === VerificationDocumentStatus.REJECTED);
    const pendingDocs = documents.filter(doc => doc.status === VerificationDocumentStatus.PENDING);

    // Required document types
    const requiredDocTypes = ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'];
    const hasAllRequired = requiredDocTypes.every(type => 
      approvedDocs.some(doc => doc.type === type)
    );

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

  async reviewVerificationDocument(
    documentId: string,
    adminUserId: string,
    status: VerificationDocumentStatus,
    reason?: string
  ) {
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
      throw new NotFoundException('Verification document not found');
    }

    if (document.status !== VerificationDocumentStatus.PENDING) {
      throw new BadRequestException('Document has already been reviewed');
    }

    // Update document status
    const updatedDocument = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

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

      // Log admin action
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

    // Check if cleaner should be verified after this review
    await this.checkCleanerVerificationStatus(document.cleanerUserId, adminUserId);

    return updatedDocument;
  }

  async verifyCleaner(cleanerUserId: string, adminUserId: string, verified: boolean, reason?: string) {
    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId: cleanerUserId },
      include: {
        user: true,
        verificationDocuments: true,
      },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner not found');
    }

    // Update verification status
    const updatedCleaner = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

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

      // Log admin action
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
    const [
      totalCleaners,
      verifiedCleaners,
      pendingVerifications,
      rejectedCleaners,
      documentsCount,
      recentVerifications,
    ] = await Promise.all([
      this.prisma.cleanerProfile.count(),
      this.prisma.cleanerProfile.count({
        where: { isVerified: true },
      }),
      this.prisma.verificationDocument.count({
        where: { status: VerificationDocumentStatus.PENDING },
      }),
      this.prisma.cleanerProfile.count({
        where: { 
          isVerified: false,
          verificationDocuments: {
            some: {
              status: VerificationDocumentStatus.REJECTED,
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
          status: { not: VerificationDocumentStatus.PENDING },
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

  private async checkCleanerVerificationStatus(cleanerUserId: string, adminUserId: string) {
    const documents = await this.prisma.verificationDocument.findMany({
      where: { cleanerUserId },
    });

    const requiredTypes = ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'];
    const hasAllApproved = requiredTypes.every(type => 
      documents.some(doc => doc.type === type && doc.status === VerificationDocumentStatus.APPROVED)
    );

    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId: cleanerUserId },
    });

    // Auto-verify if all required documents are approved
    if (hasAllApproved && !cleaner?.isVerified) {
      await this.verifyCleaner(cleanerUserId, adminUserId, true, 'Auto-verified: All required documents approved');
    }
    // Auto-unverify if any required document is rejected  
    else if (!hasAllApproved && cleaner?.isVerified) {
      await this.verifyCleaner(cleanerUserId, adminUserId, false, 'Auto-unverified: Required document rejected');
    }
  }

  async bulkVerifyCleaners(cleanerIds: string[], adminUserId: string, verified: boolean, reason?: string) {
    const results = [];

    for (const cleanerId of cleanerIds) {
      try {
        const result = await this.verifyCleaner(cleanerId, adminUserId, verified, reason);
        results.push({ cleanerId, success: true, cleaner: result });
      } catch (error) {
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

  async getVerificationMetrics(dateFrom?: Date, dateTo?: Date) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.reviewedAt = {};
      if (dateFrom) whereClause.reviewedAt.gte = dateFrom;
      if (dateTo) whereClause.reviewedAt.lte = dateTo;
    }

    const verificationTrends = await this.prisma.verificationDocument.groupBy({
      by: ['status'],
      where: { ...whereClause, reviewedAt: { not: null } },
      _count: { status: true },
    });

    const dailyVerifications = await this.prisma.$queryRaw`
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
}
