import { PrismaService } from '../prisma/prisma.service';
import { VerificationService } from './verification.service';
import { DisputeService } from './dispute.service';
import { PaymentsService } from '../payments/payments.service';
import { BookingsService } from '../bookings/bookings.service';
export declare class AdminService {
    private prisma;
    private verificationService;
    private disputeService;
    private paymentsService;
    private bookingsService;
    constructor(prisma: PrismaService, verificationService: VerificationService, disputeService: DisputeService, paymentsService: PaymentsService, bookingsService: BookingsService);
    getDashboardOverview(): Promise<{
        userStats: {
            totalUsers: number;
            totalClients: number;
            totalCleaners: number;
            verifiedCleaners: number;
            activeCleaners: number;
            verificationRate: number;
        };
        bookingStats: {
            totalBookings: number;
            completedBookings: number;
            thisMonthBookings: number;
            bookingGrowth: number;
            completionRate: number;
        };
        revenueStats: {
            totalRevenue: number;
            thisMonthRevenue: number;
        };
        alertsStats: {
            pendingDisputes: number;
            pendingVerifications: number;
            totalAlerts: number;
        };
        recentActivity: ({
            actor: {
                clientProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            actorUserId: string;
            action: string;
            entity: string;
            entityId: string;
        })[];
    }>;
    getPlatformAnalytics(dateFrom?: Date, dateTo?: Date): Promise<{
        bookings: {
            totalBookings: number;
            completedBookings: number;
            cancelledBookings: number;
            completionRate: number;
            avgBookingValue: number;
            bookingsByStatus: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.BookingGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            recentBookings: ({
                cleaner: {
                    cleanerProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        active: boolean;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                };
                client: {
                    clientProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                };
                cleanerService: {
                    service: {
                        name: string;
                        id: string;
                        createdAt: Date;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
            } & {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                cleanerUserId: string | null;
                clientUserId: string;
                cleanerServiceId: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
            })[];
        };
        payments: {
            totalRecharges: number;
            totalCommissions: number;
            totalTransactions: number;
            rechargeCount: number;
            commissionCount: number;
            monthlyRecharges: unknown;
            monthlyCommissions: unknown;
            netRevenue: number;
        };
        verifications: {
            verificationTrends: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VerificationDocumentGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            dailyVerifications: unknown;
        };
        disputes: {
            totalDisputes: number;
            openDisputes: number;
            resolvedDisputes: number;
            rejectedDisputes: number;
            resolutionRate: number;
            disputesByStatus: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.DisputeGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            recentDisputes: ({
                booking: {
                    cleanerService: {
                        service: {
                            name: string;
                            id: string;
                            createdAt: Date;
                            categoryId: string;
                            description: string | null;
                            baseDurationMin: number;
                        };
                    } & {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        cleanerUserId: string;
                        serviceId: string;
                        priceMad: number;
                        active: boolean;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string | null;
                    clientUserId: string;
                    cleanerServiceId: string;
                    scheduledAt: Date;
                    addressText: string;
                    lat: number;
                    lng: number;
                    basePriceMad: number;
                    addonsTotal: number;
                    totalPriceMad: number;
                    status: import("@prisma/client").$Enums.BookingStatus;
                };
                openedBy: {
                    clientProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                    cleanerProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        active: boolean;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                bookingId: string;
                status: import("@prisma/client").$Enums.DisputeStatus;
                openedByUserId: string;
                reason: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            })[];
            avgResolutionTimeHours: any;
        };
        userGrowth: {
            userGrowth: unknown;
        };
    }>;
    getUserGrowthTrends(dateFrom?: Date, dateTo?: Date): Promise<{
        userGrowth: unknown;
    }>;
    getAllUsers(filters?: any): Promise<{
        updatedAt: Date;
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        createdAt: Date;
    }[]>;
    getUserDetails(userId: string): Promise<{
        updatedAt: Date;
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    getFraudFlags(filters?: any): Promise<({
        user: {
            clientProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            updatedAt: Date;
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        reason: string;
        severity: string;
    })[]>;
    createFraudFlag(userId: string, type: string, severity: string, reason: string, adminUserId: string): Promise<{
        user: {
            clientProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            updatedAt: Date;
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        reason: string;
        severity: string;
    }>;
    getSystemHealth(): Promise<{
        status: string;
        database: {
            connected: boolean;
            totalRecords: number;
        };
        platform: {
            totalUsers: number;
            activeCleaners: number;
            pendingBookings: number;
        };
        monitoring: {
            errorLogsLast24h: number;
            systemLoad: {
                actionsPerHour: number;
                status: string;
            };
        };
        timestamp: Date;
    }>;
    private getSystemLoadMetrics;
    getAuditLogs(filters?: any): Promise<({
        actor: {
            clientProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            updatedAt: Date;
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string;
        action: string;
        entity: string;
        entityId: string;
    })[]>;
    updatePlatformSettings(adminUserId: string, settings: any): Promise<{
        success: boolean;
        settings: any;
    }>;
    getPerformanceMetrics(): Promise<{
        apiCalls: {
            last24Hours: number;
            last7Days: number;
            dailyAverage: number;
        };
        performance: {
            avgResponseTime: number;
            errorRate: number;
        };
        topActions: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.AuditLogGroupByOutputType, "action"[]> & {
            _count: {
                action: number;
            };
        })[];
        timestamp: Date;
    }>;
    private calculateAverageResponseTime;
    private calculateErrorRate;
    getContentModerationQueue(): Promise<{
        pendingVerifications: unknown[];
        openDisputes: ({
            booking: {
                cleaner: {
                    cleanerProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        active: boolean;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                };
                client: {
                    clientProfile: {
                        updatedAt: Date;
                        id: string;
                        createdAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                };
                cleanerService: {
                    service: {
                        name: string;
                        id: string;
                        createdAt: Date;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
            } & {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                cleanerUserId: string | null;
                clientUserId: string;
                cleanerServiceId: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
            };
            openedBy: {
                clientProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
            resolver: {
                clientProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            bookingId: string;
            status: import("@prisma/client").$Enums.DisputeStatus;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        })[];
        recentReviews: ({
            cleaner: {
                cleanerProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
            booking: {
                cleanerService: {
                    service: {
                        name: string;
                        id: string;
                        createdAt: Date;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
            } & {
                updatedAt: Date;
                id: string;
                createdAt: Date;
                cleanerUserId: string | null;
                clientUserId: string;
                cleanerServiceId: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
            };
            client: {
                clientProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            bookingId: string;
            clientUserId: string;
            rating: number;
            comment: string | null;
        })[];
        flaggedContent: ({
            user: {
                clientProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    updatedAt: Date;
                    id: string;
                    createdAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            type: string;
            userId: string;
            reason: string;
            severity: string;
        })[];
        totalItems: number;
    }>;
}
