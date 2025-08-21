import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleBookingCleanup() {
    this.logger.log('Running booking cleanup task');
    
    try {
      // Handle timeout bookings - auto-complete if client doesn't confirm within 48h
      const timeoutDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago
      
      const timeoutBookings = await this.prisma.booking.updateMany({
        where: {
          status: 'COMPLETED',
          updatedAt: { lt: timeoutDate },
        },
        data: {
          status: 'CLIENT_CONFIRMED',
        },
      });

      if (timeoutBookings.count > 0) {
        this.logger.log(`Auto-confirmed ${timeoutBookings.count} timeout bookings`);
      }

      // Clean up old booking events (older than 90 days)
      const cleanupDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      const deletedEvents = await this.prisma.bookingEvent.deleteMany({
        where: {
          createdAt: { lt: cleanupDate },
        },
      });

      if (deletedEvents.count > 0) {
        this.logger.log(`Cleaned up ${deletedEvents.count} old booking events`);
      }

    } catch (error) {
      this.logger.error('Error in booking cleanup task:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCommissionProcessing() {
    this.logger.log('Running commission processing task');
    
    try {
      // Process pending commissions
      const pendingCommissions = await this.prisma.commission.findMany({
        where: {
          status: 'PENDING',
        },
        include: {
          booking: true,
          cleaner: {
            include: {
              wallet: true,
            },
          },
        },
      });

      for (const commission of pendingCommissions) {
        try {
          // Apply commission to wallet
          await this.prisma.$transaction(async (tx) => {
            // Deduct commission from wallet
            await tx.wallet.update({
              where: { ownerUserId: commission.cleanerUserId },
              data: {
                balanceMad: {
                  decrement: commission.commissionMad,
                },
              },
            });

            // Add wallet transaction
            await tx.walletTransaction.create({
              data: {
                walletOwnerUserId: commission.cleanerUserId,
                type: 'COMMISSION',
                amountMad: -commission.commissionMad,
                bookingId: commission.bookingId,
                meta: {
                  commissionId: commission.id,
                  commissionRate: commission.percentage,
                },
              },
            });

            // Mark commission as applied
            await tx.commission.update({
              where: { id: commission.id },
              data: { status: 'APPLIED' },
            });
          });

          this.logger.log(`Applied commission ${commission.id} for cleaner ${commission.cleanerUserId}`);
        } catch (error) {
          this.logger.error(`Failed to apply commission ${commission.id}:`, error);
        }
      }

    } catch (error) {
      this.logger.error('Error in commission processing task:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleWalletMonitoring() {
    this.logger.log('Running wallet monitoring task');
    
    try {
      // Find wallets with negative balances exceeding thresholds
      const problematicWallets = await this.prisma.wallet.findMany({
        where: {
          balanceMad: { lt: -100 }, // Alert for debts over 100 MAD
        },
        include: {
          owner: {
            include: {
              cleanerProfile: true,
              debtThresholds: true,
            },
          },
        },
      });

      for (const wallet of problematicWallets) {
        const threshold = wallet.owner.debtThresholds?.[0]?.debtLimitMad || -200;
        
        if (wallet.balanceMad < threshold) {
          // Create fraud flag for excessive debt
          await this.prisma.fraudFlag.create({
            data: {
              userId: wallet.ownerUserId,
              type: 'EXCESSIVE_DEBT',
              severity: 'HIGH',
              reason: `Wallet balance ${wallet.balanceMad} MAD exceeds debt threshold ${threshold} MAD`,
            },
          });

          this.logger.warn(`Created fraud flag for cleaner ${wallet.ownerUserId} - excessive debt`);
        }
      }

    } catch (error) {
      this.logger.error('Error in wallet monitoring task:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleFraudDetection() {
    this.logger.log('Running fraud detection task');
    
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Detect cleaners with high cancellation rates
      const cleanerStats = await this.prisma.$queryRaw`
        SELECT 
          cleaner_user_id,
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_bookings,
          (SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END)::float / COUNT(*)::float) as cancellation_rate
        FROM bookings 
        WHERE created_at >= ${thirtyDaysAgo}
          AND cleaner_user_id IS NOT NULL
        GROUP BY cleaner_user_id
        HAVING COUNT(*) >= 5
          AND (SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END)::float / COUNT(*)::float) > 0.3
      `;

      for (const stat of cleanerStats as any[]) {
        await this.prisma.fraudFlag.create({
          data: {
            userId: stat.cleaner_user_id,
            type: 'HIGH_CANCELLATION_RATE',
            severity: 'MEDIUM',
            reason: `High cancellation rate: ${(stat.cancellation_rate * 100).toFixed(1)}% (${stat.cancelled_bookings}/${stat.total_bookings} bookings)`,
          },
        });

        this.logger.warn(`Created fraud flag for cleaner ${stat.cleaner_user_id} - high cancellation rate`);
      }

      // Detect clients with unusual booking patterns
      const clientStats = await this.prisma.$queryRaw`
        SELECT 
          client_user_id,
          COUNT(*) as total_bookings,
          COUNT(DISTINCT cleaner_user_id) as unique_cleaners
        FROM bookings 
        WHERE created_at >= ${thirtyDaysAgo}
        GROUP BY client_user_id
        HAVING COUNT(*) >= 10
          AND COUNT(DISTINCT cleaner_user_id) = 1
      `;

      for (const stat of clientStats as any[]) {
        await this.prisma.fraudFlag.create({
          data: {
            userId: stat.client_user_id,
            type: 'SUSPICIOUS_BOOKING_PATTERN',
            severity: 'LOW',
            reason: `${stat.total_bookings} bookings with only 1 cleaner in 30 days`,
          },
        });

        this.logger.warn(`Created fraud flag for client ${stat.client_user_id} - suspicious booking pattern`);
      }

    } catch (error) {
      this.logger.error('Error in fraud detection task:', error);
    }
  }

  // Manual trigger methods for testing
  async triggerBookingCleanup() {
    await this.handleBookingCleanup();
  }

  async triggerCommissionProcessing() {
    await this.handleCommissionProcessing();
  }

  async triggerWalletMonitoring() {
    await this.handleWalletMonitoring();
  }

  async triggerFraudDetection() {
    await this.handleFraudDetection();
  }
}
