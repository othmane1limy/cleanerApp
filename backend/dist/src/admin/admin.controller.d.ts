import { AdminService } from './admin.service';
import { VerificationService } from './verification.service';
import { DisputeService } from './dispute.service';
import { DisputeStatus, VerificationDocumentStatus } from '@cleaning-marketplace/shared';
export declare class AdminController {
    private readonly adminService;
    private readonly verificationService;
    private readonly disputeService;
    constructor(adminService: AdminService, verificationService: VerificationService, disputeService: DisputeService);
    getDashboard(): Promise<{
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
    getAnalytics(dateFrom?: string, dateTo?: string): Promise<{
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
    getAllUsers(filters: any): Promise<{
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
    getPendingVerifications(): Promise<unknown[]>;
    getVerificationStatistics(): Promise<{
        totalCleaners: number;
        verifiedCleaners: number;
        pendingVerifications: number;
        rejectedCleaners: number;
        verificationRate: number;
        documentsCount: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VerificationDocumentGroupByOutputType, "status"[]> & {
            _count: {
                status: number;
            };
        })[];
        recentVerifications: ({
            cleaner: {
                user: {
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
            reviewer: {
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
            type: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            url: string;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        })[];
    }>;
    getCleanerVerificationStatus(cleanerId: string): Promise<{
        cleaner: {
            user: {
                updatedAt: Date;
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
            };
            services: ({
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
            })[];
            verificationDocuments: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                type: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                url: string;
                reviewedBy: string | null;
                reviewedAt: Date | null;
            }[];
        } & {
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
        verificationStatus: {
            isVerified: boolean;
            hasAllRequiredDocuments: boolean;
            documentsCount: {
                total: number;
                approved: number;
                rejected: number;
                pending: number;
            };
            requiredDocuments: {
                type: string;
                status: string;
                document: {
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string;
                    type: string;
                    status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                    url: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                };
            }[];
        };
        documents: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            type: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            url: string;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
    }>;
    reviewDocument(req: any, documentId: string, body: {
        status: VerificationDocumentStatus;
        reason?: string;
    }): Promise<{
        cleaner: {
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
        reviewer: {
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
        type: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        url: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    updateCleanerVerification(req: any, cleanerId: string, body: {
        verified: boolean;
        reason?: string;
    }): Promise<{
        user: {
            updatedAt: Date;
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
        };
        verificationDocuments: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            type: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            url: string;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
    } & {
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
    }>;
    getDisputes(filters: any): Promise<({
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
    })[]>;
    getDisputeDetails(disputeId: string): Promise<{
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
            events: ({
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
                bookingId: string;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                actorUserId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
            })[];
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
    }>;
    resolveDispute(req: any, disputeId: string, body: {
        status: DisputeStatus;
        resolutionNote: string;
    }): Promise<{
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
    }>;
    getDisputeStatistics(): Promise<{
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
    }>;
    getFraudFlags(filters: any): Promise<({
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
    createFraudFlag(req: any, body: {
        userId: string;
        type: string;
        severity: string;
        reason: string;
    }): Promise<{
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
    getAuditLogs(filters: any): Promise<({
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
    getModerationQueue(): Promise<{
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
    updateSettings(req: any, settings: any): Promise<{
        success: boolean;
        settings: any;
    }>;
}
