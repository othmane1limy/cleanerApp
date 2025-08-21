import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from './wallet.service';
import { PaypalService } from './paypal.service';
import { WalletTransactionType, shouldBlockCleaner } from '@cleaning-marketplace/shared';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private paypalService: PaypalService,
    private configService: ConfigService,
  ) {}

  // ======================
  // Wallet Operations
  // ======================

  async getCleanerWallet(cleanerUserId: string) {
    return this.walletService.getWallet(cleanerUserId);
  }

  async getWalletTransactions(cleanerUserId: string, filters?: any) {
    return this.walletService.getTransactionHistory(cleanerUserId, filters);
  }

  async getWalletStatistics(cleanerUserId: string) {
    return this.walletService.getWalletStatistics(cleanerUserId);
  }

  // ======================
  // PayPal Integration
  // ======================

  async createRechargeOrder(cleanerUserId: string, amountMad: number) {
    // Validate cleaner exists
    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId: cleanerUserId },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner profile not found');
    }

    // Validate amount
    if (amountMad < 50) {
      throw new BadRequestException('Minimum recharge amount is 50 MAD');
    }

    if (amountMad > 10000) {
      throw new BadRequestException('Maximum recharge amount is 10,000 MAD');
    }

    // Create PayPal order
    const paypalOrder = await this.paypalService.createOrder(amountMad, 'MAD');

    // Store pending recharge in database for tracking
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
      // Could store pending payment record here if needed
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

  async processRechargeCompletion(cleanerUserId: string, paypalOrderId: string) {
    // Capture PayPal payment
    const captureResult = await this.paypalService.captureOrder(paypalOrderId);

    if (captureResult.status !== 'COMPLETED') {
      throw new BadRequestException('PayPal payment not completed');
    }

    // Extract payment details
    const captureDetails = captureResult.purchase_units[0].payments.captures[0];
    const paidAmountUsd = parseFloat(captureDetails.amount.value);
    const amountMad = this.paypalService.parsePaypalAmount(captureDetails.amount.value);

    // Process wallet recharge
    const result = await this.walletService.rechargeWallet(
      cleanerUserId,
      amountMad,
      captureDetails.id,
      {
        paypalOrderId,
        captureId: captureDetails.id,
        paidAmountUsd,
        conversionRate: amountMad / paidAmountUsd,
        paypalStatus: captureResult.status,
        paymentTime: captureDetails.create_time,
      }
    );

    return {
      ...result,
      paypalOrder: captureResult,
      message: `Successfully recharged ${amountMad} MAD to your wallet`,
    };
  }

  async handlePaypalWebhook(headers: any, body: any) {
    // Verify webhook authenticity
    const isVerified = await this.paypalService.verifyWebhook(headers, body);
    
    if (!isVerified) {
      throw new BadRequestException('Invalid PayPal webhook signature');
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

  private async handleOrderApproved(resource: any) {
    // Log order approval
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  private async handlePaymentCaptured(resource: any) {
    // Log successful payment capture
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  private async handlePaymentDenied(resource: any) {
    // Log failed payment
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  // ======================
  // Commission Management
  // ======================

  async getCommissionHistory(cleanerUserId: string, filters?: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    let whereClause: any = {
      cleanerUserId,
    };

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
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

  async getCommissionSummary(cleanerUserId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalCommissions,
      freeJobsCommissions,
      paidJobsCommissions,
      thisMonthCommissions,
      thisYearCommissions,
    ] = await Promise.all([
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

  // ======================
  // Admin Operations
  // ======================

  async getAllWallets(filters?: any) {
    let whereClause: any = {};

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
      isBlocked: shouldBlockCleaner(
        wallet.balanceMad,
        wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200
      ),
    }));
  }

  async getPaymentAnalytics(dateFrom?: Date, dateTo?: Date) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) whereClause.createdAt.lte = dateTo;
    }

    const [
      totalRecharges,
      totalCommissions,
      totalTransactions,
      rechargesByMonth,
      commissionsByMonth,
    ] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: { ...whereClause, type: WalletTransactionType.RECHARGE },
        _sum: { amountMad: true },
        _count: { id: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: { ...whereClause, type: WalletTransactionType.COMMISSION },
        _sum: { amountMad: true },
        _count: { id: true },
      }),
      this.prisma.walletTransaction.count({ where: whereClause }),
      this.prisma.$queryRaw`
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
      this.prisma.$queryRaw`
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

  // ======================
  // Payment Processing
  // ======================

  async initiateWalletRecharge(cleanerUserId: string, amountMad: number) {
    // Validate cleaner
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
      throw new NotFoundException('Cleaner profile not found');
    }

    // Create PayPal order
    const paypalOrder = await this.paypalService.createOrder(amountMad, 'MAD');

    return {
      orderId: paypalOrder.id,
      approveUrl: paypalOrder.links.find((link: any) => link.rel === 'approve')?.href,
      amountMad,
      currentBalance: cleaner.user.wallet?.balanceMad || 0,
    };
  }

  async completeWalletRecharge(cleanerUserId: string, paypalOrderId: string) {
    return this.processRechargeCompletion(cleanerUserId, paypalOrderId);
  }

  async processWebhook(headers: any, body: any) {
    return this.handlePaypalWebhook(headers, body);
  }

  // ======================
  // Debt Management
  // ======================

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
        return shouldBlockCleaner(wallet.balanceMad, debtThreshold);
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

  async adjustWalletBalance(cleanerUserId: string, amount: number, reason: string, adminUserId: string) {
    // Validate adjustment
    if (Math.abs(amount) > 5000) {
      throw new BadRequestException('Maximum adjustment amount is 5,000 MAD');
    }

    // Create adjustment transaction
    const transaction = await this.walletService.addTransaction(
      cleanerUserId,
      WalletTransactionType.ADJUSTMENT,
      amount,
      undefined,
      {
        reason,
        adjustedBy: adminUserId,
        adjustmentDate: new Date(),
      }
    );

    // Log admin action
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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
}
