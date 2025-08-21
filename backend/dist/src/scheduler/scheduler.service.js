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
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    prisma;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleBookingCleanup() {
        this.logger.log('Running booking cleanup task');
        try {
            const timeoutDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
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
            const cleanupDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const deletedEvents = await this.prisma.bookingEvent.deleteMany({
                where: {
                    createdAt: { lt: cleanupDate },
                },
            });
            if (deletedEvents.count > 0) {
                this.logger.log(`Cleaned up ${deletedEvents.count} old booking events`);
            }
        }
        catch (error) {
            this.logger.error('Error in booking cleanup task:', error);
        }
    }
    async handleCommissionProcessing() {
        this.logger.log('Running commission processing task');
        try {
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
                    await this.prisma.$transaction(async (tx) => {
                        await tx.wallet.update({
                            where: { ownerUserId: commission.cleanerUserId },
                            data: {
                                balanceMad: {
                                    decrement: commission.commissionMad,
                                },
                            },
                        });
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
                        await tx.commission.update({
                            where: { id: commission.id },
                            data: { status: 'APPLIED' },
                        });
                    });
                    this.logger.log(`Applied commission ${commission.id} for cleaner ${commission.cleanerUserId}`);
                }
                catch (error) {
                    this.logger.error(`Failed to apply commission ${commission.id}:`, error);
                }
            }
        }
        catch (error) {
            this.logger.error('Error in commission processing task:', error);
        }
    }
    async handleWalletMonitoring() {
        this.logger.log('Running wallet monitoring task');
        try {
            const problematicWallets = await this.prisma.wallet.findMany({
                where: {
                    balanceMad: { lt: -100 },
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
        }
        catch (error) {
            this.logger.error('Error in wallet monitoring task:', error);
        }
    }
    async handleFraudDetection() {
        this.logger.log('Running fraud detection task');
        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const cleanerStats = await this.prisma.$queryRaw `
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
            for (const stat of cleanerStats) {
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
            const clientStats = await this.prisma.$queryRaw `
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
            for (const stat of clientStats) {
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
        }
        catch (error) {
            this.logger.error('Error in fraud detection task:', error);
        }
    }
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
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleBookingCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleCommissionProcessing", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleWalletMonitoring", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_4AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleFraudDetection", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map