import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationService } from './verification.service';
import { DisputeService } from './dispute.service';
import { PaymentsService } from '../payments/payments.service';
import { BookingsService } from '../bookings/bookings.service';
import { UserRole, BookingStatus } from '@cleaning-marketplace/shared';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private verificationService: VerificationService,
    private disputeService: DisputeService,
    private paymentsService: PaymentsService,
    private bookingsService: BookingsService,
  ) {}

  // ======================
  // Dashboard Analytics
  // ======================

  async getDashboardOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalClients,
      totalCleaners,
      verifiedCleaners,
      activeCleaners,
      totalBookings,
      completedBookings,
      thisMonthBookings,
      totalRevenue,
      thisMonthRevenue,
      pendingDisputes,
      pendingVerifications,
      recentActivity,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.CLIENT } }),
      this.prisma.user.count({ where: { role: UserRole.CLEANER } }),
      this.prisma.cleanerProfile.count({ where: { isVerified: true } }),
      this.prisma.cleanerProfile.count({ where: { active: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.CLIENT_CONFIRMED } }),
      this.prisma.booking.count({
        where: {
          status: BookingStatus.CLIENT_CONFIRMED,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.walletTransaction.aggregate({
        where: { type: 'COMMISSION' },
        _sum: { amountMad: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          type: 'COMMISSION',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amountMad: true },
      }),
      this.prisma.dispute.count({ where: { status: 'OPEN' } }),
      this.prisma.verificationDocument.count({ where: { status: 'PENDING' } }),
      this.prisma.auditLog.findMany({
        where: { createdAt: { gte: startOfWeek } },
        include: {
          actor: {
            include: {
              clientProfile: true,
              cleanerProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    // Calculate growth rates
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastMonthBookings = await this.prisma.booking.count({
      where: {
        status: BookingStatus.CLIENT_CONFIRMED,
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    const bookingGrowth = lastMonthBookings > 0 
      ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 
      : 0;

    return {
      userStats: {
        totalUsers,
        totalClients,
        totalCleaners,
        verifiedCleaners,
        activeCleaners,
        verificationRate: totalCleaners > 0 ? (verifiedCleaners / totalCleaners) * 100 : 0,
      },
      bookingStats: {
        totalBookings,
        completedBookings,
        thisMonthBookings,
        bookingGrowth,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      },
      revenueStats: {
        totalRevenue: Math.abs(totalRevenue._sum.amountMad || 0),
        thisMonthRevenue: Math.abs(thisMonthRevenue._sum.amountMad || 0),
      },
      alertsStats: {
        pendingDisputes,
        pendingVerifications,
        totalAlerts: pendingDisputes + pendingVerifications,
      },
      recentActivity,
    };
  }

  async getPlatformAnalytics(dateFrom?: Date, dateTo?: Date) {
    // Get comprehensive platform analytics
    const [
      bookingAnalytics,
      paymentAnalytics,
      verificationMetrics,
      disputeStatistics,
      userGrowthTrends,
    ] = await Promise.all([
      this.bookingsService.getBookingAnalytics(dateFrom, dateTo),
      this.paymentsService.getPaymentAnalytics(dateFrom, dateTo),
      this.verificationService.getVerificationMetrics(dateFrom, dateTo),
      this.disputeService.getDisputeStatistics(),
      this.getUserGrowthTrends(dateFrom, dateTo),
    ]);

    return {
      bookings: bookingAnalytics,
      payments: paymentAnalytics,
      verifications: verificationMetrics,
      disputes: disputeStatistics,
      userGrowth: userGrowthTrends,
    };
  }

  async getUserGrowthTrends(dateFrom?: Date, dateTo?: Date) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) whereClause.createdAt.lte = dateTo;
    }

    const userGrowth = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        role,
        COUNT(*) as new_users
      FROM users 
      WHERE true
        ${dateFrom ? `AND created_at >= ${dateFrom}` : ''}
        ${dateTo ? `AND created_at <= ${dateTo}` : ''}
      GROUP BY DATE_TRUNC('day', created_at), role
      ORDER BY date DESC
      LIMIT 30
    `;

    return { userGrowth };
  }

  // ======================
  // User Management
  // ======================

  async getAllUsers(filters?: any) {
    let whereClause: any = {};

    if (filters?.role) {
      whereClause.role = filters.role;
    }

    if (filters?.emailVerified !== undefined) {
      whereClause.emailVerified = filters.emailVerified;
    }

    if (filters?.search) {
      whereClause.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        {
          clientProfile: {
            OR: [
              { firstName: { contains: filters.search, mode: 'insensitive' } },
              { lastName: { contains: filters.search, mode: 'insensitive' } },
            ],
          },
        },
        {
          cleanerProfile: {
            businessName: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      include: {
        clientProfile: true,
        cleanerProfile: {
          include: {
            verificationDocuments: {
              where: { status: 'PENDING' },
            },
          },
        },
        wallet: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return users;
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: {
          include: {
            defaultLocation: true,
          },
        },
        cleanerProfile: {
          include: {
            baseLocation: true,
            services: {
              include: {
                service: true,
                addons: true,
                photos: true,
              },
            },
            verificationDocuments: {
              orderBy: { createdAt: 'desc' },
            },
            liveLocation: true,
          },
        },
        clientBookings: {
          include: {
            cleanerService: {
              include: {
                service: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        cleanerBookings: {
          include: {
            client: {
              include: {
                clientProfile: true,
              },
            },
            cleanerService: {
              include: {
                service: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        supportTickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        fraudFlags: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ======================
  // Fraud Detection
  // ======================

  async getFraudFlags(filters?: any) {
    let whereClause: any = {};

    if (filters?.severity) {
      whereClause.severity = filters.severity;
    }

    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
    }

    const fraudFlags = await this.prisma.fraudFlag.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            clientProfile: true,
            cleanerProfile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return fraudFlags;
  }

  async createFraudFlag(userId: string, type: string, severity: string, reason: string, adminUserId: string) {
    const fraudFlag = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

      const flag = await tx.fraudFlag.create({
        data: {
          userId,
          type,
          severity,
          reason,
        },
        include: {
          user: {
            include: {
              clientProfile: true,
              cleanerProfile: true,
            },
          },
        },
      });

      // Log admin action
      await tx.auditLog.create({
        data: {
          actorUserId: adminUserId,
          action: 'FRAUD_FLAG_CREATED',
          entity: 'fraud_flag',
          entityId: flag.id,
          meta: {
            flaggedUserId: userId,
            type,
            severity,
            reason,
          },
        },
      });

      return flag;
    });

    return fraudFlag;
  }

  // ======================
  // System Monitoring
  // ======================

  async getSystemHealth() {
    const [
      dbConnectionTest,
      totalUsers,
      activeCleaners,
      pendingBookings,
      errorLogs,
      systemLoad,
    ] = await Promise.all([
      this.prisma.user.count(), // Test DB connection
      this.prisma.user.count(),
      this.prisma.cleanerProfile.count({ where: { active: true } }),
      this.prisma.booking.count({
        where: {
          status: {
            in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED, BookingStatus.ON_THE_WAY],
          },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          action: { contains: 'ERROR' },
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      this.getSystemLoadMetrics(),
    ]);

    const isHealthy = dbConnectionTest >= 0 && errorLogs < 100; // Basic health check

    return {
      status: isHealthy ? 'HEALTHY' : 'DEGRADED',
      database: {
        connected: true,
        totalRecords: dbConnectionTest,
      },
      platform: {
        totalUsers,
        activeCleaners,
        pendingBookings,
      },
      monitoring: {
        errorLogsLast24h: errorLogs,
        systemLoad,
      },
      timestamp: new Date(),
    };
  }

  private async getSystemLoadMetrics() {
    // Get recent activity metrics
    const recentActivity = await this.prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
      },
    });

    return {
      actionsPerHour: recentActivity,
      status: recentActivity > 1000 ? 'HIGH' : recentActivity > 100 ? 'MEDIUM' : 'LOW',
    };
  }

  async getAuditLogs(filters?: any) {
    let whereClause: any = {};

    if (filters?.action) {
      whereClause.action = { contains: filters.action, mode: 'insensitive' };
    }

    if (filters?.entity) {
      whereClause.entity = filters.entity;
    }

    if (filters?.actorUserId) {
      whereClause.actorUserId = filters.actorUserId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
    }

    const auditLogs = await this.prisma.auditLog.findMany({
      where: whereClause,
      include: {
        actor: {
          include: {
            clientProfile: true,
            cleanerProfile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });

    return auditLogs;
  }

  // ======================
  // Platform Configuration
  // ======================

  async updatePlatformSettings(adminUserId: string, settings: any) {
    // This would typically update a settings table
    // For now, we'll log the settings change
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN', true)`;

      await tx.auditLog.create({
        data: {
          actorUserId: adminUserId,
          action: 'PLATFORM_SETTINGS_UPDATED',
          entity: 'platform_settings',
          entityId: 'global',
          meta: settings,
        },
      });
    });

    return { success: true, settings };
  }

  async getPerformanceMetrics() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      apiCallsLast24h,
      apiCallsLast7d,
      avgResponseTime,
      errorRate,
      topActions,
    ] = await Promise.all([
      this.prisma.auditLog.count({
        where: { createdAt: { gte: last24Hours } },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: last7Days } },
      }),
      this.calculateAverageResponseTime(),
      this.calculateErrorRate(last24Hours),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where: { createdAt: { gte: last7Days } },
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      apiCalls: {
        last24Hours: apiCallsLast24h,
        last7Days: apiCallsLast7d,
        dailyAverage: Math.round(apiCallsLast7d / 7),
      },
      performance: {
        avgResponseTime,
        errorRate,
      },
      topActions,
      timestamp: new Date(),
    };
  }

  private async calculateAverageResponseTime(): Promise<number> {
    // This would typically involve tracking request/response times
    // For now, return a placeholder
    return Math.random() * 100 + 50; // 50-150ms simulated
  }

  private async calculateErrorRate(since: Date): Promise<number> {
    const totalActions = await this.prisma.auditLog.count({
      where: { createdAt: { gte: since } },
    });

    const errorActions = await this.prisma.auditLog.count({
      where: {
        createdAt: { gte: since },
        action: { contains: 'ERROR' },
      },
    });

    return totalActions > 0 ? (errorActions / totalActions) * 100 : 0;
  }

  // ======================
  // Content Moderation
  // ======================

  async getContentModerationQueue() {
    const [
      pendingVerifications,
      openDisputes,
      recentReviews,
      flaggedContent,
    ] = await Promise.all([
      this.verificationService.getPendingVerifications(),
      this.disputeService.getDisputes({ status: 'OPEN', limit: 20 }),
      this.prisma.review.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
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
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.fraudFlag.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        include: {
          user: {
            include: {
              clientProfile: true,
              cleanerProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return {
      pendingVerifications,
      openDisputes,
      recentReviews,
      flaggedContent,
      totalItems: 
        (Array.isArray(pendingVerifications) ? pendingVerifications.length : 0) +
        openDisputes.length +
        recentReviews.length +
        flaggedContent.length,
    };
  }
}
