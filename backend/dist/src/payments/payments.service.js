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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const wallet_service_1 = require("./wallet.service");
const paypal_service_1 = require("./paypal.service");
const shared_1 = require("@cleaning-marketplace/shared");
let PaymentsService = class PaymentsService {
    prisma;
    walletService;
    paypalService;
    configService;
    constructor(prisma, walletService, paypalService, configService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.paypalService = paypalService;
        this.configService = configService;
    }
    async getCleanerWallet(cleanerUserId) {
        return this.walletService.getWallet(cleanerUserId);
    }
    async getWalletTransactions(cleanerUserId, filters) {
        return this.walletService.getTransactionHistory(cleanerUserId, filters);
    }
    async getWalletStatistics(cleanerUserId) {
        return this.walletService.getWalletStatistics(cleanerUserId);
    }
    async createRechargeOrder(cleanerUserId, amountMad) {
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId: cleanerUserId },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        if (amountMad < 50) {
            throw new common_1.BadRequestException('Minimum recharge amount is 50 MAD');
        }
        if (amountMad > 10000) {
            throw new common_1.BadRequestException('Maximum recharge amount is 10,000 MAD');
        }
        const paypalOrder = await this.paypalService.createOrder(amountMad, 'MAD');
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: cleanerUserId,
                    action: 'RECHARGE_INITIATED',
                    entity: 'wallet',
                    entityId: cleanerUserId,
                    meta: {
                        amountMad,
                        paypalOrderId: paypalOrder.id,
                        status: 'PENDING',
                    },
                },
            });
        });
        return {
            paypalOrder,
            amountMad,
            message: 'PayPal order created successfully',
        };
    }
    async processRechargeCompletion(cleanerUserId, paypalOrderId) {
        const captureResult = await this.paypalService.captureOrder(paypalOrderId);
        if (captureResult.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('PayPal payment not completed');
        }
        const captureDetails = captureResult.purchase_units[0].payments.captures[0];
        const paidAmountUsd = parseFloat(captureDetails.amount.value);
        const amountMad = this.paypalService.parsePaypalAmount(captureDetails.amount.value);
        const result = await this.walletService.rechargeWallet(cleanerUserId, amountMad, captureDetails.id, {
            paypalOrderId,
            captureId: captureDetails.id,
            paidAmountUsd,
            conversionRate: amountMad / paidAmountUsd,
            paypalStatus: captureResult.status,
            paymentTime: captureDetails.create_time,
        });
        return {
            ...result,
            paypalOrder: captureResult,
            message: `Successfully recharged ${amountMad} MAD to your wallet`,
        };
    }
    async handlePaypalWebhook(headers, body) {
        const isVerified = await this.paypalService.verifyWebhook(headers, body);
        if (!isVerified) {
            throw new common_1.BadRequestException('Invalid PayPal webhook signature');
        }
        const eventType = body.event_type;
        const resource = body.resource;
        console.log(`PayPal webhook received: ${eventType}`);
        switch (eventType) {
            case 'CHECKOUT.ORDER.APPROVED':
                await this.handleOrderApproved(resource);
                break;
            case 'PAYMENT.CAPTURE.COMPLETED':
                await this.handlePaymentCaptured(resource);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                await this.handlePaymentDenied(resource);
                break;
            default:
                console.log(`Unhandled PayPal webhook event: ${eventType}`);
        }
        return { received: true };
    }
    async handleOrderApproved(resource) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: 'system',
                    action: 'PAYPAL_ORDER_APPROVED',
                    entity: 'payment',
                    entityId: resource.id,
                    meta: {
                        orderId: resource.id,
                        status: resource.status,
                        amount: resource.purchase_units[0].amount,
                    },
                },
            });
        });
    }
    async handlePaymentCaptured(resource) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: 'system',
                    action: 'PAYPAL_PAYMENT_CAPTURED',
                    entity: 'payment',
                    entityId: resource.id,
                    meta: {
                        captureId: resource.id,
                        orderId: resource.supplementary_data?.related_ids?.order_id,
                        amount: resource.amount,
                        status: resource.status,
                    },
                },
            });
        });
    }
    async handlePaymentDenied(resource) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: 'system',
                    action: 'PAYPAL_PAYMENT_DENIED',
                    entity: 'payment',
                    entityId: resource.id,
                    meta: {
                        captureId: resource.id,
                        amount: resource.amount,
                        status: resource.status,
                        reason: resource.status_details?.reason,
                    },
                },
            });
        });
    }
    async getCommissionHistory(cleanerUserId, filters) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        let whereClause = {
            cleanerUserId,
        };
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.createdAt = {};
            if (filters.dateFrom)
                whereClause.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                whereClause.createdAt.lte = new Date(filters.dateTo);
        }
        const commissions = await this.prisma.commission.findMany({
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
        return commissions;
    }
    async getCommissionSummary(cleanerUserId) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const [totalCommissions, freeJobsCommissions, paidJobsCommissions, thisMonthCommissions, thisYearCommissions,] = await Promise.all([
            this.prisma.commission.aggregate({
                where: { cleanerUserId },
                _sum: { commissionMad: true },
                _count: { id: true },
            }),
            this.prisma.commission.aggregate({
                where: {
                    cleanerUserId,
                    commissionMad: 0,
                },
                _count: { id: true },
            }),
            this.prisma.commission.aggregate({
                where: {
                    cleanerUserId,
                    commissionMad: { gt: 0 },
                },
                _sum: { commissionMad: true },
                _count: { id: true },
            }),
            this.prisma.commission.aggregate({
                where: {
                    cleanerUserId,
                    createdAt: { gte: startOfMonth },
                },
                _sum: { commissionMad: true },
                _count: { id: true },
            }),
            this.prisma.commission.aggregate({
                where: {
                    cleanerUserId,
                    createdAt: { gte: startOfYear },
                },
                _sum: { commissionMad: true },
                _count: { id: true },
            }),
        ]);
        const freeJobsRemaining = Math.max(0, 20 - (freeJobsCommissions._count.id || 0));
        return {
            totalJobs: totalCommissions._count.id || 0,
            freeJobs: freeJobsCommissions._count.id || 0,
            paidJobs: paidJobsCommissions._count.id || 0,
            freeJobsRemaining,
            totalCommissionPaid: totalCommissions._sum.commissionMad || 0,
            thisMonthCommissions: thisMonthCommissions._sum.commissionMad || 0,
            thisYearCommissions: thisYearCommissions._sum.commissionMad || 0,
            thisMonthJobs: thisMonthCommissions._count.id || 0,
            thisYearJobs: thisYearCommissions._count.id || 0,
        };
    }
    async getAllWallets(filters) {
        let whereClause = {};
        if (filters?.minBalance !== undefined) {
            whereClause.balanceMad = { gte: filters.minBalance };
        }
        if (filters?.maxBalance !== undefined) {
            whereClause.balanceMad = {
                ...whereClause.balanceMad,
                lte: filters.maxBalance,
            };
        }
        const wallets = await this.prisma.wallet.findMany({
            where: whereClause,
            include: {
                owner: {
                    include: {
                        cleanerProfile: true,
                        debtThresholds: true,
                    },
                },
            },
            orderBy: { balanceMad: 'asc' },
            take: 100,
        });
        return wallets.map((wallet) => ({
            ...wallet,
            isBlocked: (0, shared_1.shouldBlockCleaner)(wallet.balanceMad, wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200),
        }));
    }
    async getPaymentAnalytics(dateFrom, dateTo) {
        const whereClause = {};
        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom)
                whereClause.createdAt.gte = dateFrom;
            if (dateTo)
                whereClause.createdAt.lte = dateTo;
        }
        const [totalRecharges, totalCommissions, totalTransactions, rechargesByMonth, commissionsByMonth,] = await Promise.all([
            this.prisma.walletTransaction.aggregate({
                where: { ...whereClause, type: shared_1.WalletTransactionType.RECHARGE },
                _sum: { amountMad: true },
                _count: { id: true },
            }),
            this.prisma.walletTransaction.aggregate({
                where: { ...whereClause, type: shared_1.WalletTransactionType.COMMISSION },
                _sum: { amountMad: true },
                _count: { id: true },
            }),
            this.prisma.walletTransaction.count({ where: whereClause }),
            this.prisma.$queryRaw `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          SUM(amount_mad) as total_amount,
          COUNT(*) as transaction_count
        FROM wallet_transactions 
        WHERE type = 'RECHARGE'
          ${dateFrom ? `AND created_at >= ${dateFrom}` : ''}
          ${dateTo ? `AND created_at <= ${dateTo}` : ''}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `,
            this.prisma.$queryRaw `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          ABS(SUM(amount_mad)) as total_amount,
          COUNT(*) as transaction_count
        FROM wallet_transactions 
        WHERE type = 'COMMISSION'
          ${dateFrom ? `AND created_at >= ${dateFrom}` : ''}
          ${dateTo ? `AND created_at <= ${dateTo}` : ''}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `,
        ]);
        return {
            totalRecharges: totalRecharges._sum.amountMad || 0,
            totalCommissions: Math.abs(totalCommissions._sum.amountMad || 0),
            totalTransactions,
            rechargeCount: totalRecharges._count.id || 0,
            commissionCount: totalCommissions._count.id || 0,
            monthlyRecharges: rechargesByMonth,
            monthlyCommissions: commissionsByMonth,
            netRevenue: Math.abs(totalCommissions._sum.amountMad || 0),
        };
    }
    async initiateWalletRecharge(cleanerUserId, amountMad) {
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId: cleanerUserId },
            include: {
                user: {
                    include: {
                        wallet: true,
                    },
                },
            },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        const paypalOrder = await this.paypalService.createOrder(amountMad, 'MAD');
        return {
            orderId: paypalOrder.id,
            approveUrl: paypalOrder.links.find((link) => link.rel === 'approve')?.href,
            amountMad,
            currentBalance: cleaner.user.wallet?.balanceMad || 0,
        };
    }
    async completeWalletRecharge(cleanerUserId, paypalOrderId) {
        return this.processRechargeCompletion(cleanerUserId, paypalOrderId);
    }
    async processWebhook(headers, body) {
        return this.handlePaypalWebhook(headers, body);
    }
    async getBlockedCleaners() {
        const wallets = await this.prisma.wallet.findMany({
            include: {
                owner: {
                    include: {
                        cleanerProfile: true,
                        debtThresholds: true,
                    },
                },
            },
        });
        const blockedCleaners = wallets
            .filter((wallet) => {
            const debtThreshold = wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200;
            return (0, shared_1.shouldBlockCleaner)(wallet.balanceMad, debtThreshold);
        })
            .map((wallet) => ({
            cleanerId: wallet.ownerUserId,
            cleaner: wallet.owner.cleanerProfile,
            balance: wallet.balanceMad,
            debtThreshold: wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200,
            debtAmount: Math.abs(wallet.balanceMad),
        }));
        return blockedCleaners;
    }
    async adjustWalletBalance(cleanerUserId, amount, reason, adminUserId) {
        if (Math.abs(amount) > 5000) {
            throw new common_1.BadRequestException('Maximum adjustment amount is 5,000 MAD');
        }
        const transaction = await this.walletService.addTransaction(cleanerUserId, shared_1.WalletTransactionType.ADJUSTMENT, amount, undefined, {
            reason,
            adjustedBy: adminUserId,
            adjustmentDate: new Date(),
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId: adminUserId,
                    action: 'WALLET_ADJUSTMENT',
                    entity: 'wallet',
                    entityId: cleanerUserId,
                    meta: {
                        amount,
                        reason,
                        transactionId: transaction.id,
                    },
                },
            });
        });
        return transaction;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        paypal_service_1.PaypalService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map