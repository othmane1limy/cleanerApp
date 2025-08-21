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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            actorUserId: string;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
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
                cleanerService: {
                    service: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
                client: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
                cleaner: {
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                updatedAt: Date;
                clientUserId: string;
                cleanerUserId: string | null;
                cleanerServiceId: string;
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
                            id: string;
                            createdAt: Date;
                            name: string;
                            categoryId: string;
                            description: string | null;
                            baseDurationMin: number;
                        };
                    } & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        cleanerUserId: string;
                        serviceId: string;
                        priceMad: number;
                        active: boolean;
                    };
                } & {
                    id: string;
                    scheduledAt: Date;
                    addressText: string;
                    lat: number;
                    lng: number;
                    basePriceMad: number;
                    addonsTotal: number;
                    totalPriceMad: number;
                    status: import("@prisma/client").$Enums.BookingStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    clientUserId: string;
                    cleanerUserId: string | null;
                    cleanerServiceId: string;
                };
                openedBy: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.DisputeStatus;
                createdAt: Date;
                bookingId: string;
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
    getAllUsers(filters?: any): Promise<({
        clientProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            defaultLocationId: string | null;
        };
        cleanerProfile: {
            verificationDocuments: {
                id: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                createdAt: Date;
                cleanerUserId: string;
                url: string;
                type: string;
                reviewedBy: string | null;
                reviewedAt: Date | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        wallet: {
            updatedAt: Date;
            ownerUserId: string;
            balanceMad: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
    })[]>;
    getUserDetails(userId: string): Promise<{
        clientProfile: {
            defaultLocation: {
                id: string;
                addressText: string;
                lat: number;
                lng: number;
                createdAt: Date;
                userId: string | null;
                label: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            defaultLocationId: string | null;
        };
        cleanerProfile: {
            services: ({
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
                addons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerServiceId: string;
                    priceMad: number;
                    active: boolean;
                    name: string;
                    extraDurationMin: number;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    cleanerServiceId: string;
                    url: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            })[];
            baseLocation: {
                id: string;
                addressText: string;
                lat: number;
                lng: number;
                createdAt: Date;
                userId: string | null;
                label: string;
            };
            verificationDocuments: {
                id: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                createdAt: Date;
                cleanerUserId: string;
                url: string;
                type: string;
                reviewedBy: string | null;
                reviewedAt: Date | null;
            }[];
            liveLocation: {
                lat: number;
                lng: number;
                updatedAt: Date;
                cleanerUserId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        clientBookings: ({
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            };
        } & {
            id: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
        })[];
        cleanerBookings: ({
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
        })[];
        supportTickets: {
            id: string;
            status: import("@prisma/client").$Enums.SupportTicketStatus;
            createdAt: Date;
            userId: string;
            message: string;
            subject: string;
            channel: import("@prisma/client").$Enums.SupportChannel;
        }[];
        fraudFlags: {
            id: string;
            createdAt: Date;
            reason: string;
            userId: string;
            type: string;
            severity: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
    }>;
    getFraudFlags(filters?: any): Promise<({
        user: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        reason: string;
        userId: string;
        type: string;
        severity: string;
    })[]>;
    createFraudFlag(userId: string, type: string, severity: string, reason: string, adminUserId: string): Promise<{
        user: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        reason: string;
        userId: string;
        type: string;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        actorUserId: string;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
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
                cleanerService: {
                    service: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
                client: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
                cleaner: {
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                updatedAt: Date;
                clientUserId: string;
                cleanerUserId: string | null;
                cleanerServiceId: string;
            };
            openedBy: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            resolver: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.DisputeStatus;
            createdAt: Date;
            bookingId: string;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        })[];
        recentReviews: ({
            booking: {
                cleanerService: {
                    service: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        categoryId: string;
                        description: string | null;
                        baseDurationMin: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                    active: boolean;
                };
                client: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
                cleaner: {
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                scheduledAt: Date;
                addressText: string;
                lat: number;
                lng: number;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                updatedAt: Date;
                clientUserId: string;
                cleanerUserId: string | null;
                cleanerServiceId: string;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            clientUserId: string;
            cleanerUserId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        })[];
        flaggedContent: ({
            user: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            reason: string;
            userId: string;
            type: string;
            severity: string;
        })[];
        totalItems: number;
    }>;
}
