import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, UserRole } from '@cleaning-marketplace/shared';
import { calculateCommission } from '@cleaning-marketplace/shared';

@Injectable()
export class BookingStatusService {
  constructor(private prisma: PrismaService) {}

  // Status transition rules
  private readonly statusTransitions = {
    [BookingStatus.REQUESTED]: [BookingStatus.ACCEPTED, BookingStatus.CANCELLED],
    [BookingStatus.ACCEPTED]: [BookingStatus.ON_THE_WAY, BookingStatus.CANCELLED],
    [BookingStatus.ON_THE_WAY]: [BookingStatus.ARRIVED, BookingStatus.CANCELLED],
    [BookingStatus.ARRIVED]: [BookingStatus.IN_PROGRESS],
    [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
    [BookingStatus.COMPLETED]: [BookingStatus.CLIENT_CONFIRMED, BookingStatus.DISPUTED],
    [BookingStatus.CLIENT_CONFIRMED]: [], // Final state
    [BookingStatus.DISPUTED]: [BookingStatus.CLIENT_CONFIRMED], // After admin resolution
    [BookingStatus.CANCELLED]: [], // Final state
  };

  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    actorUserId: string,
    actorRole: UserRole,
    meta?: any
  ) {
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
      throw new BadRequestException('Booking not found');
    }

    // Validate permission to update status
    this.validateStatusUpdatePermission(booking, newStatus, actorUserId, actorRole);

    // Validate status transition
    const validTransitions = this.statusTransitions[booking.status] || [];
    if (!validTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${booking.status} to ${newStatus}`
      );
    }

    // Perform status update in transaction
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      // Set system context for privileged operations
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      // Update booking status
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

      // Create booking event for audit trail
      await tx.bookingEvent.create({
        data: {
          bookingId,
          actorUserId,
          oldStatus: booking.status,
          newStatus,
          meta,
        },
      });

      // Handle special status transitions
      await this.handleStatusTransition(tx, booking, newStatus);

      return updated;
    });

    return updatedBooking;
  }

  private validateStatusUpdatePermission(
    booking: any,
    newStatus: BookingStatus,
    actorUserId: string,
    actorRole: UserRole
  ) {
    // Admin can change any status
    if (actorRole === UserRole.ADMIN) {
      return;
    }

    // Client permissions
    if (actorRole === UserRole.CLIENT && booking.clientUserId === actorUserId) {
      const clientAllowedStatuses = [BookingStatus.CLIENT_CONFIRMED, BookingStatus.CANCELLED, BookingStatus.DISPUTED];
      if (!clientAllowedStatuses.includes(newStatus)) {
        throw new ForbiddenException('Clients can only confirm, cancel, or dispute bookings');
      }
      return;
    }

    // Cleaner permissions
    if (actorRole === UserRole.CLEANER && booking.cleanerUserId === actorUserId) {
      const cleanerAllowedStatuses = [
        BookingStatus.ACCEPTED,
        BookingStatus.ON_THE_WAY,
        BookingStatus.ARRIVED,
        BookingStatus.IN_PROGRESS,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
      ];
      if (!cleanerAllowedStatuses.includes(newStatus)) {
        throw new ForbiddenException('Cleaners can only manage their assigned bookings');
      }
      return;
    }

    throw new ForbiddenException('Insufficient permissions to update booking status');
  }

  private async handleStatusTransition(tx: any, booking: any, newStatus: BookingStatus) {
    switch (newStatus) {
      case BookingStatus.ACCEPTED:
        await this.handleBookingAccepted(tx, booking);
        break;

      case BookingStatus.COMPLETED:
        await this.handleBookingCompleted(tx, booking);
        break;

      case BookingStatus.CLIENT_CONFIRMED:
        await this.handleClientConfirmation(tx, booking);
        break;

      case BookingStatus.CANCELLED:
        await this.handleBookingCancelled(tx, booking);
        break;
    }
  }

  private async handleBookingAccepted(tx: any, booking: any) {
    // Update cleaner stats
    // Could add notification logic here
    console.log(`Booking ${booking.id} accepted by cleaner ${booking.cleanerUserId}`);
  }

  private async handleBookingCompleted(tx: any, booking: any) {
    // Mark as pending client confirmation
    // Auto-confirm after 48 hours if no client response (handled by scheduled task)
    console.log(`Booking ${booking.id} completed, awaiting client confirmation`);
  }

  private async handleClientConfirmation(tx: any, booking: any) {
    if (!booking.cleaner?.cleanerProfile) {
      throw new BadRequestException('Cleaner profile not found');
    }

    const cleanerProfile = booking.cleaner.cleanerProfile;

    // Update cleaner's completed job count
    await tx.cleanerProfile.update({
      where: { userId: booking.cleanerUserId },
      data: {
        completedJobsCount: {
          increment: 1,
        },
        freeJobsUsed: cleanerProfile.freeJobsUsed < 20 ? { increment: 1 } : undefined,
      },
    });

    // Calculate and apply commission if not a free job
    const { commissionAmount, isFreeJob } = calculateCommission(
      booking.totalPriceMad,
      cleanerProfile.completedJobsCount,
      20,
      0.07
    );

    if (!isFreeJob && commissionAmount > 0) {
      // Create commission record
      await tx.commission.create({
        data: {
          cleanerUserId: booking.cleanerUserId,
          bookingId: booking.id,
          percentage: 7.0,
          commissionMad: commissionAmount,
          status: 'PENDING',
        },
      });

      // Deduct commission from cleaner wallet
      await tx.wallet.update({
        where: { ownerUserId: booking.cleanerUserId },
        data: {
          balanceMad: {
            decrement: commissionAmount,
          },
        },
      });

      // Create wallet transaction
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

      // Update commission status to applied
      await tx.commission.update({
        where: { bookingId: booking.id },
        data: { status: 'APPLIED' },
      });
    } else {
      // Create commission record for free job (0 amount)
      await tx.commission.create({
        data: {
          cleanerUserId: booking.cleanerUserId,
          bookingId: booking.id,
          percentage: 0,
          commissionMad: 0,
          status: 'APPLIED',
        },
      });

      // Create wallet transaction for free job
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

    console.log(
      `Booking ${booking.id} confirmed by client. Commission: ${commissionAmount} MAD (Free job: ${isFreeJob})`
    );
  }

  private async handleBookingCancelled(tx: any, booking: any) {
    // Handle cancellation logic
    // Could implement cancellation fees if needed
    console.log(`Booking ${booking.id} cancelled`);
  }

  async autoConfirmExpiredBookings() {
    // Find bookings completed more than 48 hours ago without client confirmation
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        updatedAt: {
          lt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
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
        await this.updateBookingStatus(
          booking.id,
          BookingStatus.CLIENT_CONFIRMED,
          'system', // System user for auto-confirmation
          UserRole.ADMIN,
          { autoConfirmed: true, reason: 'Client confirmation timeout' }
        );

        // Flag for admin review
        await this.prisma.$transaction(async (tx) => {
          await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
          
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
      } catch (error) {
        console.error(`Failed to auto-confirm booking ${booking.id}:`, error);
      }
    }
  }

  async getBookingStatusHistory(bookingId: string) {
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

  async canUpdateBookingStatus(bookingId: string, userId: string, role: UserRole): Promise<boolean> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return false;
    }

    // Admin can always update
    if (role === UserRole.ADMIN) {
      return true;
    }

    // Client or cleaner must be participant
    return booking.clientUserId === userId || booking.cleanerUserId === userId;
  }
}
