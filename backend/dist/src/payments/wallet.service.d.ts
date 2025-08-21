import { PrismaService } from '../prisma/prisma.service';
import { WalletTransactionType } from '@cleaning-marketplace/shared';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    getWallet(cleanerUserId: string): Promise<{
        debtThreshold: number;
        isBlocked: boolean;
        recentTransactions: ({
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
        } & {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            bookingId: string | null;
            walletOwnerUserId: string;
            amountMad: number;
        })[];
        owner: {
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
            debtThresholds: {
                id: string;
                debtLimitMad: number;
                cleanerUserId: string;
            }[];
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
        updatedAt: Date;
        balanceMad: number;
        ownerUserId: string;
    }>;
    getTransactionHistory(cleanerUserId: string, filters?: any): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        bookingId: string | null;
        walletOwnerUserId: string;
        amountMad: number;
    })[]>;
    addTransaction(cleanerUserId: string, type: WalletTransactionType, amount: number, bookingId?: string, meta?: any): Promise<{
        id: string;
        createdAt: Date;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        bookingId: string | null;
        walletOwnerUserId: string;
        amountMad: number;
    }>;
    rechargeWallet(cleanerUserId: string, amount: number, paymentId: string, meta?: any): Promise<{
        transaction: {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            bookingId: string | null;
            walletOwnerUserId: string;
            amountMad: number;
        };
        wallet: {
            debtThreshold: number;
            isBlocked: boolean;
            recentTransactions: ({
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
            } & {
                id: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                type: import("@prisma/client").$Enums.WalletTransactionType;
                bookingId: string | null;
                walletOwnerUserId: string;
                amountMad: number;
            })[];
            owner: {
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
                debtThresholds: {
                    id: string;
                    debtLimitMad: number;
                    cleanerUserId: string;
                }[];
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
            updatedAt: Date;
            balanceMad: number;
            ownerUserId: string;
        };
        message: string;
    }>;
    getWalletStatistics(cleanerUserId: string): Promise<{
        currentBalance: number;
        totalCommissionsPaid: number;
        totalRecharges: number;
        thisMonthCommissions: number;
        thisYearCommissions: number;
        totalCommissionJobs: number;
        totalRechargeCount: number;
        recentTransactions: ({
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
        } & {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            bookingId: string | null;
            walletOwnerUserId: string;
            amountMad: number;
        })[];
    }>;
    checkWalletStatus(cleanerUserId: string): Promise<{
        blocked: boolean;
        reason: string;
        balance?: undefined;
        debtThreshold?: undefined;
    } | {
        blocked: boolean;
        balance: number;
        debtThreshold: number;
        reason: string;
    }>;
    updateDebtThreshold(cleanerUserId: string, newLimit: number): Promise<{
        id: string;
        debtLimitMad: number;
        cleanerUserId: string;
    }>;
    getWalletInsights(cleanerUserId: string): Promise<{
        balanceBreakdown: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.WalletTransactionGroupByOutputType, "type"[]> & {
            _count: {
                id: number;
            };
            _sum: {
                amountMad: number;
            };
        })[];
        monthlyTrends: unknown;
    }>;
}
