import { PrismaService } from '../prisma/prisma.service';
import { DisputeStatus } from '@cleaning-marketplace/shared';
export declare class DisputeService {
    private prisma;
    constructor(prisma: PrismaService);
    createDispute(bookingId: string, userId: string, reason: string): Promise<{
        booking: {
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
        };
        openedBy: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        resolutionNote: string | null;
    }>;
    getDisputes(filters?: any): Promise<({
        booking: {
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
        };
        openedBy: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        resolver: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        resolutionNote: string | null;
    })[]>;
    getDisputeById(disputeId: string): Promise<{
        booking: {
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            events: ({
                actor: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        userId: string;
                        defaultLocationId: string | null;
                    };
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        active: boolean;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                        baseLocationId: string | null;
                    };
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                actorUserId: string;
                bookingId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
        };
        openedBy: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        resolver: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        resolutionNote: string | null;
    }>;
    resolveDispute(disputeId: string, adminUserId: string, status: DisputeStatus, resolutionNote: string): Promise<{
        booking: {
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
        };
        openedBy: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        resolver: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        resolutionNote: string | null;
    }>;
    updateDisputeStatus(disputeId: string, adminUserId: string, status: DisputeStatus, note?: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
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
                        id: string;
                        createdAt: Date;
                        name: string;
                        description: string | null;
                        categoryId: string;
                        baseDurationMin: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    cleanerUserId: string;
                    serviceId: string;
                    priceMad: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string | null;
                status: import("@prisma/client").$Enums.BookingStatus;
                lat: number;
                lng: number;
                addressText: string;
                clientUserId: string;
                cleanerServiceId: string;
                scheduledAt: Date;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
            };
            openedBy: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            openedByUserId: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        })[];
        avgResolutionTimeHours: any;
    }>;
    getDisputeTrends(dateFrom?: Date, dateTo?: Date): Promise<{
        dailyDisputes: unknown;
    }>;
}
