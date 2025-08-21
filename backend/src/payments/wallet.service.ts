import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletTransactionType, UserRole } from '@cleaning-marketplace/shared';
import { shouldBlockCleaner } from '@cleaning-marketplace/shared';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // Wallet Management
  // ======================

  async getWallet(cleanerUserId: string) {
    // Set user context for RLS
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
      throw new NotFoundException('Wallet not found');
    }

    // Get debt threshold
    const debtThreshold = wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200;
    const isBlocked = shouldBlockCleaner(wallet.balanceMad, debtThreshold);

    // Get recent transactions
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

  async getTransactionHistory(cleanerUserId: string, filters?: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    let whereClause: any = {
      walletOwnerUserId: cleanerUserId,
    };

    // Apply filters
    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
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

  async addTransaction(
    cleanerUserId: string,
    type: WalletTransactionType,
    amount: number,
    bookingId?: string,
    meta?: any
  ) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Set system context for privileged operations
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      // Update wallet balance
      await tx.wallet.update({
        where: { ownerUserId: cleanerUserId },
        data: {
          balanceMad: {
            increment: amount, // Can be negative for deductions
          },
        },
      });

      // Create transaction record
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

  async rechargeWallet(cleanerUserId: string, amount: number, paymentId: string, meta?: any) {
    if (amount <= 0) {
      throw new BadRequestException('Recharge amount must be positive');
    }

    if (amount > 10000) {
      throw new BadRequestException('Maximum recharge amount is 10,000 MAD');
    }

    // Create recharge transaction
    const transaction = await this.addTransaction(
      cleanerUserId,
      WalletTransactionType.RECHARGE,
      amount,
      undefined,
      {
        paymentId,
        paymentMethod: 'PAYPAL',
        rechargeAmount: amount,
        ...meta,
      }
    );

    // Get updated wallet
    const wallet = await this.getWallet(cleanerUserId);

    // Log audit event
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  async getWalletStatistics(cleanerUserId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      currentWallet,
      totalCommissions,
      totalRecharges,
      thisMonthCommissions,
      thisYearCommissions,
      recentTransactions,
    ] = await Promise.all([
      this.prisma.wallet.findUnique({
        where: { ownerUserId: cleanerUserId },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletOwnerUserId: cleanerUserId,
          type: WalletTransactionType.COMMISSION,
        },
        _sum: { amountMad: true },
        _count: { id: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletOwnerUserId: cleanerUserId,
          type: WalletTransactionType.RECHARGE,
        },
        _sum: { amountMad: true },
        _count: { id: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletOwnerUserId: cleanerUserId,
          type: WalletTransactionType.COMMISSION,
          createdAt: { gte: startOfMonth },
        },
        _sum: { amountMad: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletOwnerUserId: cleanerUserId,
          type: WalletTransactionType.COMMISSION,
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

  async checkWalletStatus(cleanerUserId: string) {
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
    const isBlocked = shouldBlockCleaner(wallet.balanceMad, debtThreshold);

    return {
      blocked: isBlocked,
      balance: wallet.balanceMad,
      debtThreshold,
      reason: isBlocked ? `Wallet balance (${wallet.balanceMad} MAD) below limit (${debtThreshold} MAD)` : null,
    };
  }

  async updateDebtThreshold(cleanerUserId: string, newLimit: number) {
    if (newLimit > 0) {
      throw new BadRequestException('Debt limit must be negative or zero');
    }

    if (newLimit < -10000) {
      throw new BadRequestException('Debt limit cannot be lower than -10,000 MAD');
    }

    const threshold = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  async getWalletInsights(cleanerUserId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    const insights = await this.prisma.walletTransaction.groupBy({
      by: ['type'],
      where: { walletOwnerUserId: cleanerUserId },
      _sum: { amountMad: true },
      _count: { id: true },
    });

    // Calculate monthly trends
    const monthlyTrends = await this.prisma.$queryRaw`
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
}
