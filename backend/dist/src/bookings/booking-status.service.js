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
exports.BookingStatusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
const shared_2 = require("@cleaning-marketplace/shared");
let BookingStatusService = class BookingStatusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    statusTransitions = {
        [shared_1.BookingStatus.REQUESTED]: [shared_1.BookingStatus.ACCEPTED, shared_1.BookingStatus.CANCELLED],
        [shared_1.BookingStatus.ACCEPTED]: [shared_1.BookingStatus.ON_THE_WAY, shared_1.BookingStatus.CANCELLED],
        [shared_1.BookingStatus.ON_THE_WAY]: [shared_1.BookingStatus.ARRIVED, shared_1.BookingStatus.CANCELLED],
        [shared_1.BookingStatus.ARRIVED]: [shared_1.BookingStatus.IN_PROGRESS],
        [shared_1.BookingStatus.IN_PROGRESS]: [shared_1.BookingStatus.COMPLETED],
        [shared_1.BookingStatus.COMPLETED]: [shared_1.BookingStatus.CLIENT_CONFIRMED, shared_1.BookingStatus.DISPUTED],
        [shared_1.BookingStatus.CLIENT_CONFIRMED]: [],
        [shared_1.BookingStatus.DISPUTED]: [shared_1.BookingStatus.CLIENT_CONFIRMED],
        [shared_1.BookingStatus.CANCELLED]: [],
    };
    async updateBookingStatus(bookingId, newStatus, actorUserId, actorRole, meta) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                cleaner: {
                    include: {
                        cleanerProfile: true,
                        wallet: true,
                    },
                },
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
        });
        if (!booking) {
            throw new common_1.BadRequestException('Booking not found');
        }
        this.validateStatusUpdatePermission(booking, newStatus, actorUserId, actorRole);
        const validTransitions = this.statusTransitions[booking.status] || [];
        if (!validTransitions.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${booking.status} to ${newStatus}`);
        }
        const updatedBooking = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            const updated = await tx.booking.update({
                where: { id: bookingId },
                data: { status: newStatus },
                include: {
                    cleaner: {
                        include: {
                            cleanerProfile: true,
                        },
                    },
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
            });
            await tx.bookingEvent.create({
                data: {
                    bookingId,
                    actorUserId,
                    oldStatus: booking.status,
                    newStatus,
                    meta,
                },
            });
            await this.handleStatusTransition(tx, booking, newStatus);
            return updated;
        });
        return updatedBooking;
    }
    validateStatusUpdatePermission(booking, newStatus, actorUserId, actorRole) {
        if (actorRole === shared_1.UserRole.ADMIN) {
            return;
        }
        if (actorRole === shared_1.UserRole.CLIENT && booking.clientUserId === actorUserId) {
            const clientAllowedStatuses = [shared_1.BookingStatus.CLIENT_CONFIRMED, shared_1.BookingStatus.CANCELLED, shared_1.BookingStatus.DISPUTED];
            if (!clientAllowedStatuses.includes(newStatus)) {
                throw new common_1.ForbiddenException('Clients can only confirm, cancel, or dispute bookings');
            }
            return;
        }
        if (actorRole === shared_1.UserRole.CLEANER && booking.cleanerUserId === actorUserId) {
            const cleanerAllowedStatuses = [
                shared_1.BookingStatus.ACCEPTED,
                shared_1.BookingStatus.ON_THE_WAY,
                shared_1.BookingStatus.ARRIVED,
                shared_1.BookingStatus.IN_PROGRESS,
                shared_1.BookingStatus.COMPLETED,
                shared_1.BookingStatus.CANCELLED,
            ];
            if (!cleanerAllowedStatuses.includes(newStatus)) {
                throw new common_1.ForbiddenException('Cleaners can only manage their assigned bookings');
            }
            return;
        }
        throw new common_1.ForbiddenException('Insufficient permissions to update booking status');
    }
    async handleStatusTransition(tx, booking, newStatus) {
        switch (newStatus) {
            case shared_1.BookingStatus.ACCEPTED:
                await this.handleBookingAccepted(tx, booking);
                break;
            case shared_1.BookingStatus.COMPLETED:
                await this.handleBookingCompleted(tx, booking);
                break;
            case shared_1.BookingStatus.CLIENT_CONFIRMED:
                await this.handleClientConfirmation(tx, booking);
                break;
            case shared_1.BookingStatus.CANCELLED:
                await this.handleBookingCancelled(tx, booking);
                break;
        }
    }
    async handleBookingAccepted(tx, booking) {
        console.log(`Booking ${booking.id} accepted by cleaner ${booking.cleanerUserId}`);
    }
    async handleBookingCompleted(tx, booking) {
        console.log(`Booking ${booking.id} completed, awaiting client confirmation`);
    }
    async handleClientConfirmation(tx, booking) {
        if (!booking.cleaner?.cleanerProfile) {
            throw new common_1.BadRequestException('Cleaner profile not found');
        }
        const cleanerProfile = booking.cleaner.cleanerProfile;
        await tx.cleanerProfile.update({
            where: { userId: booking.cleanerUserId },
            data: {
                completedJobsCount: {
                    increment: 1,
                },
                freeJobsUsed: cleanerProfile.freeJobsUsed < 20 ? { increment: 1 } : undefined,
            },
        });
        const { commissionAmount, isFreeJob } = (0, shared_2.calculateCommission)(booking.totalPriceMad, cleanerProfile.completedJobsCount, 20, 0.07);
        if (!isFreeJob && commissionAmount > 0) {
            await tx.commission.create({
                data: {
                    cleanerUserId: booking.cleanerUserId,
                    bookingId: booking.id,
                    percentage: 7.0,
                    commissionMad: commissionAmount,
                    status: 'PENDING',
                },
            });
            await tx.wallet.update({
                where: { ownerUserId: booking.cleanerUserId },
                data: {
                    balanceMad: {
                        decrement: commissionAmount,
                    },
                },
            });
            await tx.walletTransaction.create({
                data: {
                    walletOwnerUserId: booking.cleanerUserId,
                    type: 'COMMISSION',
                    amountMad: -commissionAmount,
                    bookingId: booking.id,
                    meta: {
                        jobNumber: cleanerProfile.completedJobsCount + 1,
                        commissionRate: 7.0,
                        isFreeJob: false,
                    },
                },
            });
            await tx.commission.update({
                where: { bookingId: booking.id },
                data: { status: 'APPLIED' },
            });
        }
        else {
            await tx.commission.create({
                data: {
                    cleanerUserId: booking.cleanerUserId,
                    bookingId: booking.id,
                    percentage: 0,
                    commissionMad: 0,
                    status: 'APPLIED',
                },
            });
            await tx.walletTransaction.create({
                data: {
                    walletOwnerUserId: booking.cleanerUserId,
                    type: 'COMMISSION',
                    amountMad: 0,
                    bookingId: booking.id,
                    meta: {
                        jobNumber: cleanerProfile.completedJobsCount + 1,
                        commissionRate: 0,
                        isFreeJob: true,
                    },
                },
            });
        }
        console.log(`Booking ${booking.id} confirmed by client. Commission: ${commissionAmount} MAD (Free job: ${isFreeJob})`);
    }
    async handleBookingCancelled(tx, booking) {
        console.log(`Booking ${booking.id} cancelled`);
    }
    async autoConfirmExpiredBookings() {
        const expiredBookings = await this.prisma.booking.findMany({
            where: {
                status: shared_1.BookingStatus.COMPLETED,
                updatedAt: {
                    lt: new Date(Date.now() - 48 * 60 * 60 * 1000),
                },
            },
            include: {
                cleaner: {
                    include: {
                        cleanerProfile: true,
                    },
                },
            },
        });
        for (const booking of expiredBookings) {
            try {
                await this.updateBookingStatus(booking.id, shared_1.BookingStatus.CLIENT_CONFIRMED, 'system', shared_1.UserRole.ADMIN, { autoConfirmed: true, reason: 'Client confirmation timeout' });
                await this.prisma.$transaction(async (tx) => {
                    await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
                    await tx.fraudFlag.create({
                        data: {
                            userId: booking.clientUserId,
                            type: 'AUTO_CONFIRMATION',
                            severity: 'LOW',
                            reason: 'Client did not confirm booking within 48 hours',
                        },
                    });
                });
                console.log(`Auto-confirmed booking ${booking.id} after 48 hours`);
            }
            catch (error) {
                console.error(`Failed to auto-confirm booking ${booking.id}:`, error);
            }
        }
    }
    async getBookingStatusHistory(bookingId) {
        const events = await this.prisma.bookingEvent.findMany({
            where: { bookingId },
            include: {
                actor: {
                    include: {
                        clientProfile: true,
                        cleanerProfile: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return events;
    }
    async canUpdateBookingStatus(bookingId, userId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            return false;
        }
        if (role === shared_1.UserRole.ADMIN) {
            return true;
        }
        return booking.clientUserId === userId || booking.cleanerUserId === userId;
    }
};
exports.BookingStatusService = BookingStatusService;
exports.BookingStatusService = BookingStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingStatusService);
//# sourceMappingURL=booking-status.service.js.map