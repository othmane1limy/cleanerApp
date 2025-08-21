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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const verification_service_1 = require("./verification.service");
const dispute_service_1 = require("./dispute.service");
const payments_service_1 = require("../payments/payments.service");
const bookings_service_1 = require("../bookings/bookings.service");
const shared_1 = require("@cleaning-marketplace/shared");
let AdminService = class AdminService {
    prisma;
    verificationService;
    disputeService;
    paymentsService;
    bookingsService;
    constructor(prisma, verificationService, disputeService, paymentsService, bookingsService) {
        this.prisma = prisma;
        this.verificationService = verificationService;
        this.disputeService = disputeService;
        this.paymentsService = paymentsService;
        this.bookingsService = bookingsService;
    }
    async getDashboardOverview() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalUsers, totalClients, totalCleaners, verifiedCleaners, activeCleaners, totalBookings, completedBookings, thisMonthBookings, totalRevenue, thisMonthRevenue, pendingDisputes, pendingVerifications, recentActivity,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: shared_1.UserRole.CLIENT } }),
            this.prisma.user.count({ where: { role: shared_1.UserRole.CLEANER } }),
            this.prisma.cleanerProfile.count({ where: { isVerified: true } }),
            this.prisma.cleanerProfile.count({ where: { active: true } }),
            this.prisma.booking.count(),
            this.prisma.booking.count({ where: { status: shared_1.BookingStatus.CLIENT_CONFIRMED } }),
            this.prisma.booking.count({
                where: {
                    status: shared_1.BookingStatus.CLIENT_CONFIRMED,
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
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthBookings = await this.prisma.booking.count({
            where: {
                status: shared_1.BookingStatus.CLIENT_CONFIRMED,
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
    async getPlatformAnalytics(dateFrom, dateTo) {
        const [bookingAnalytics, paymentAnalytics, verificationMetrics, disputeStatistics, userGrowthTrends,] = await Promise.all([
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
    async getUserGrowthTrends(dateFrom, dateTo) {
        const whereClause = {};
        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom)
                whereClause.createdAt.gte = dateFrom;
            if (dateTo)
                whereClause.createdAt.lte = dateTo;
        }
        const userGrowth = await this.prisma.$queryRaw `
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
    async getAllUsers(filters) {
        let whereClause = {};
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
    async getUserDetails(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async getFraudFlags(filters) {
        let whereClause = {};
        if (filters?.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters?.type) {
            whereClause.type = filters.type;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.createdAt = {};
            if (filters.dateFrom)
                whereClause.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                whereClause.createdAt.lte = new Date(filters.dateTo);
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
    async createFraudFlag(userId, type, severity, reason, adminUserId) {
        const fraudFlag = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
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
    async getSystemHealth() {
        const [dbConnectionTest, totalUsers, activeCleaners, pendingBookings, errorLogs, systemLoad,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count(),
            this.prisma.cleanerProfile.count({ where: { active: true } }),
            this.prisma.booking.count({
                where: {
                    status: {
                        in: [shared_1.BookingStatus.REQUESTED, shared_1.BookingStatus.ACCEPTED, shared_1.BookingStatus.ON_THE_WAY],
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
        const isHealthy = dbConnectionTest >= 0 && errorLogs < 100;
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
    async getSystemLoadMetrics() {
        const recentActivity = await this.prisma.auditLog.count({
            where: {
                createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
            },
        });
        return {
            actionsPerHour: recentActivity,
            status: recentActivity > 1000 ? 'HIGH' : recentActivity > 100 ? 'MEDIUM' : 'LOW',
        };
    }
    async getAuditLogs(filters) {
        let whereClause = {};
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
            if (filters.dateFrom)
                whereClause.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                whereClause.createdAt.lte = new Date(filters.dateTo);
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
    async updatePlatformSettings(adminUserId, settings) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'ADMIN', true)`;
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
        const [apiCallsLast24h, apiCallsLast7d, avgResponseTime, errorRate, topActions,] = await Promise.all([
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
    async calculateAverageResponseTime() {
        return Math.random() * 100 + 50;
    }
    async calculateErrorRate(since) {
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
    async getContentModerationQueue() {
        const [pendingVerifications, openDisputes, recentReviews, flaggedContent,] = await Promise.all([
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
            totalItems: (Array.isArray(pendingVerifications) ? pendingVerifications.length : 0) +
                openDisputes.length +
                recentReviews.length +
                flaggedContent.length,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        verification_service_1.VerificationService,
        dispute_service_1.DisputeService,
        payments_service_1.PaymentsService,
        bookings_service_1.BookingsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map