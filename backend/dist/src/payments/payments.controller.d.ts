import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getWallet(req: any): Promise<{
        debtThreshold: number;
        isBlocked: boolean;
        recentTransactions: ({
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
        } & {
            id: string;
            createdAt: Date;
            walletOwnerUserId: string;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            amountMad: number;
            bookingId: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        owner: {
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
            debtThresholds: {
                id: string;
                cleanerUserId: string;
                debtLimitMad: number;
            }[];
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
        ownerUserId: string;
        balanceMad: number;
        updatedAt: Date;
    }>;
    getWalletTransactions(req: any, filters: any): Promise<({
        booking: {
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
    } & {
        id: string;
        createdAt: Date;
        walletOwnerUserId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        amountMad: number;
        bookingId: string | null;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getWalletStatistics(req: any): Promise<{
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
        } & {
            id: string;
            createdAt: Date;
            walletOwnerUserId: string;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            amountMad: number;
            bookingId: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    initiateRecharge(req: any, body: {
        amountMad: number;
    }): Promise<{
        orderId: any;
        approveUrl: any;
        amountMad: number;
        currentBalance: number;
    }>;
    completeRecharge(req: any, body: {
        paypalOrderId: string;
    }): Promise<{
        paypalOrder: any;
        message: string;
        transaction: {
            id: string;
            createdAt: Date;
            walletOwnerUserId: string;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            amountMad: number;
            bookingId: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        };
        wallet: {
            debtThreshold: number;
            isBlocked: boolean;
            recentTransactions: ({
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
            } & {
                id: string;
                createdAt: Date;
                walletOwnerUserId: string;
                type: import("@prisma/client").$Enums.WalletTransactionType;
                amountMad: number;
                bookingId: string | null;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
            owner: {
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
                debtThresholds: {
                    id: string;
                    cleanerUserId: string;
                    debtLimitMad: number;
                }[];
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
            ownerUserId: string;
            balanceMad: number;
            updatedAt: Date;
        };
    }>;
    paypalWebhook(headers: any, body: any): Promise<{
        received: boolean;
    }>;
    getCommissionHistory(req: any, filters: any): Promise<({
        booking: {
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
    } & {
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        bookingId: string;
        status: import("@prisma/client").$Enums.CommissionStatus;
        percentage: number;
        commissionMad: number;
    })[]>;
    getCommissionSummary(req: any): Promise<{
        totalJobs: number;
        freeJobs: number;
        paidJobs: number;
        freeJobsRemaining: number;
        totalCommissionPaid: number;
        thisMonthCommissions: number;
        thisYearCommissions: number;
        thisMonthJobs: number;
        thisYearJobs: number;
    }>;
    getAllWallets(filters: any): Promise<{
        isBlocked: boolean;
        owner: {
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
            debtThresholds: {
                id: string;
                cleanerUserId: string;
                debtLimitMad: number;
            }[];
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
        ownerUserId: string;
        balanceMad: number;
        updatedAt: Date;
    }[]>;
    getBlockedCleaners(): Promise<{
        cleanerId: string;
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
        balance: number;
        debtThreshold: number;
        debtAmount: number;
    }[]>;
    getPaymentAnalytics(dateFrom?: string, dateTo?: string): Promise<{
        totalRecharges: number;
        totalCommissions: number;
        totalTransactions: number;
        rechargeCount: number;
        commissionCount: number;
        monthlyRecharges: unknown;
        monthlyCommissions: unknown;
        netRevenue: number;
    }>;
    adjustWalletBalance(req: any, body: {
        cleanerUserId: string;
        amount: number;
        reason: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        walletOwnerUserId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        amountMad: number;
        bookingId: string | null;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
