import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DisputeStatus, UserRole } from '@cleaning-marketplace/shared';

@Injectable()
export class DisputeService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // Dispute Management
  // ======================

  async createDispute(bookingId: string, userId: string, reason: string) {
    // Verify booking exists and user is participant
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
      throw new NotFoundException('Booking not found');
    }

    // Verify user is participant in the booking
    if (booking.clientUserId !== userId && booking.cleanerUserId !== userId) {
      throw new ForbiddenException('Only booking participants can create disputes');
    }

    // Check if dispute already exists
    const existingDispute = await this.prisma.dispute.findFirst({
      where: { bookingId },
    });

    if (existingDispute) {
      throw new BadRequestException('Dispute already exists for this booking');
    }

    // Create dispute
    const dispute = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      const newDispute = await tx.dispute.create({
        data: {
          bookingId,
          openedByUserId: userId,
          reason,
          status: DisputeStatus.OPEN,
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

      // Log dispute creation
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

  async getDisputes(filters?: any) {
    let whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
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

  async getDisputeById(disputeId: string) {
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
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async resolveDispute(
    disputeId: string,
    adminUserId: string,
    status: DisputeStatus,
    resolutionNote: string
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: true,
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.status === DisputeStatus.RESOLVED || dispute.status === DisputeStatus.REJECTED) {
      throw new BadRequestException('Dispute has already been resolved');
    }

    // Resolve dispute
    const resolvedDispute = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

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

      // Log admin action
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

  async updateDisputeStatus(disputeId: string, adminUserId: string, status: DisputeStatus, note?: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const updatedDispute = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

      const updated = await tx.dispute.update({
        where: { id: disputeId },
        data: { status },
      });

      // Log status change
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
    const [
      totalDisputes,
      openDisputes,
      resolvedDisputes,
      rejectedDisputes,
      disputesByStatus,
      recentDisputes,
      avgResolutionTime,
    ] = await Promise.all([
      this.prisma.dispute.count(),
      this.prisma.dispute.count({
        where: { status: DisputeStatus.OPEN },
      }),
      this.prisma.dispute.count({
        where: { status: DisputeStatus.RESOLVED },
      }),
      this.prisma.dispute.count({
        where: { status: DisputeStatus.REJECTED },
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
      this.prisma.$queryRaw`
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

  async getDisputeTrends(dateFrom?: Date, dateTo?: Date) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) whereClause.createdAt.lte = dateTo;
    }

    const dailyDisputes = await this.prisma.$queryRaw`
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
}
