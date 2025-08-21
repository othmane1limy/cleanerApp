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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
const shared_2 = require("@cleaning-marketplace/shared");
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(cleanerUserId) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        const wallet = await this.prisma.wallet.findUnique({
            where: { ownerUserId: cleanerUserId },
            include: {
                owner: {
                    include: {
                        cleanerProfile: true,
                        debtThresholds: true,
                    },
                },
            },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const debtThreshold = wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200;
        const isBlocked = (0, shared_2.shouldBlockCleaner)(wallet.balanceMad, debtThreshold);
        const recentTransactions = await this.prisma.walletTransaction.findMany({
            where: { walletOwnerUserId: cleanerUserId },
            orderBy: { createdAt: 'desc' },
            take: 10,
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
            },
        });
        return {
            ...wallet,
            debtThreshold,
            isBlocked,
            recentTransactions,
        };
    }
    async getTransactionHistory(cleanerUserId, filters) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        let whereClause = {
            walletOwnerUserId: cleanerUserId,
        };
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
        const transactions = await this.prisma.walletTransaction.findMany({
            where: whereClause,
            include: {
                booking: {
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
                },
            },
            orderBy: { createdAt: 'desc' },
            take: filters?.limit || 50,
            skip: filters?.offset || 0,
        });
        return transactions;
    }
    async addTransaction(cleanerUserId, type, amount, bookingId, meta) {
        const transaction = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.wallet.update({
                where: { ownerUserId: cleanerUserId },
                data: {
                    balanceMad: {
                        increment: amount,
                    },
                },
            });
            const walletTransaction = await tx.walletTransaction.create({
                data: {
                    walletOwnerUserId: cleanerUserId,
                    type,
                    amountMad: amount,
                    bookingId,
                    meta,
                },
            });
            return walletTransaction;
        });
        return transaction;
    }
    async rechargeWallet(cleanerUserId, amount, paymentId, meta) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Recharge amount must be positive');
        }
        if (amount > 10000) {
            throw new common_1.BadRequestException('Maximum recharge amount is 10,000 MAD');
        }
        const transaction = await this.addTransaction(cleanerUserId, shared_1.WalletTransactionType.RECHARGE, amount, undefined, {
            paymentId,
            paymentMethod: 'PAYPAL',
            rechargeAmount: amount,
            ...meta,
        });
        const wallet = await this.getWallet(cleanerUserId);
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: cleanerUserId,
                    action: 'WALLET_RECHARGE',
                    entity: 'wallet',
                    entityId: cleanerUserId,
                    meta: {
                        amount,
                        paymentId,
                        newBalance: wallet.balanceMad,
                    },
                },
            });
        });
        return {
            transaction,
            wallet,
            message: `Wallet recharged successfully with ${amount} MAD`,
        };
    }
    async getWalletStatistics(cleanerUserId) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const [currentWallet, totalCommissions, totalRecharges, thisMonthCommissions, thisYearCommissions, recentTransactions,] = await Promise.all([
            this.prisma.wallet.findUnique({
                where: { ownerUserId: cleanerUserId },
            }),
            this.prisma.walletTransaction.aggregate({
                where: {
                    walletOwnerUserId: cleanerUserId,
                    type: shared_1.WalletTransactionType.COMMISSION,
                },
                _sum: { amountMad: true },
                _count: { id: true },
            }),
            this.prisma.walletTransaction.aggregate({
                where: {
                    walletOwnerUserId: cleanerUserId,
                    type: shared_1.WalletTransactionType.RECHARGE,
                },
                _sum: { amountMad: true },
                _count: { id: true },
            }),
            this.prisma.walletTransaction.aggregate({
                where: {
                    walletOwnerUserId: cleanerUserId,
                    type: shared_1.WalletTransactionType.COMMISSION,
                    createdAt: { gte: startOfMonth },
                },
                _sum: { amountMad: true },
            }),
            this.prisma.walletTransaction.aggregate({
                where: {
                    walletOwnerUserId: cleanerUserId,
                    type: shared_1.WalletTransactionType.COMMISSION,
                    createdAt: { gte: startOfYear },
                },
                _sum: { amountMad: true },
            }),
            this.prisma.walletTransaction.findMany({
                where: { walletOwnerUserId: cleanerUserId },
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
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        return {
            currentBalance: currentWallet?.balanceMad || 0,
            totalCommissionsPaid: Math.abs(totalCommissions._sum.amountMad || 0),
            totalRecharges: totalRecharges._sum.amountMad || 0,
            thisMonthCommissions: Math.abs(thisMonthCommissions._sum.amountMad || 0),
            thisYearCommissions: Math.abs(thisYearCommissions._sum.amountMad || 0),
            totalCommissionJobs: totalCommissions._count.id || 0,
            totalRechargeCount: totalRecharges._count.id || 0,
            recentTransactions,
        };
    }
    async checkWalletStatus(cleanerUserId) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { ownerUserId: cleanerUserId },
            include: {
                owner: {
                    include: {
                        debtThresholds: true,
                    },
                },
            },
        });
        if (!wallet) {
            return { blocked: true, reason: 'Wallet not found' };
        }
        const debtThreshold = wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200;
        const isBlocked = (0, shared_2.shouldBlockCleaner)(wallet.balanceMad, debtThreshold);
        return {
            blocked: isBlocked,
            balance: wallet.balanceMad,
            debtThreshold,
            reason: isBlocked ? `Wallet balance (${wallet.balanceMad} MAD) below limit (${debtThreshold} MAD)` : null,
        };
    }
    async updateDebtThreshold(cleanerUserId, newLimit) {
        if (newLimit > 0) {
            throw new common_1.BadRequestException('Debt limit must be negative or zero');
        }
        if (newLimit < -10000) {
            throw new common_1.BadRequestException('Debt limit cannot be lower than -10,000 MAD');
        }
        const threshold = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            return tx.debtThreshold.upsert({
                where: { cleanerUserId },
                update: { debtLimitMad: newLimit },
                create: {
                    cleanerUserId,
                    debtLimitMad: newLimit,
                },
            });
        });
        return threshold;
    }
    async getWalletInsights(cleanerUserId) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        const insights = await this.prisma.walletTransaction.groupBy({
            by: ['type'],
            where: { walletOwnerUserId: cleanerUserId },
            _sum: { amountMad: true },
            _count: { id: true },
        });
        const monthlyTrends = await this.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        type,
        SUM(amount_mad) as total_amount,
        COUNT(*) as transaction_count
      FROM wallet_transactions 
      WHERE wallet_owner_user_id = ${cleanerUserId}
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at), type
      ORDER BY month DESC
    `;
        return {
            balanceBreakdown: insights,
            monthlyTrends,
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map