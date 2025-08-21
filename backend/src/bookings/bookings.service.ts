import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatusService } from './booking-status.service';
import { BookingStatus, UserRole } from '@cleaning-marketplace/shared';
import { generateBookingReference, calculateDistance, shouldBlockCleaner } from '@cleaning-marketplace/shared';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private bookingStatusService: BookingStatusService,
  ) {}

  // ======================
  // Booking Creation & Management
  // ======================

  async createBooking(clientUserId: string, bookingData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(clientUserId, 'CLIENT');

    // Validate client profile exists
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId: clientUserId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    // Get cleaner service details
    const cleanerService = await this.prisma.cleanerService.findUnique({
      where: { id: bookingData.cleanerServiceId },
      include: {
        service: true,
        cleaner: {
          include: {
            user: {
              include: {
                wallet: true,
              },
            },
          },
        },
        addons: {
          where: { active: true },
        },
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Service not found');
    }

    if (!cleanerService.active) {
      throw new BadRequestException('Service is not available');
    }

    if (!cleanerService.cleaner.active) {
      throw new BadRequestException('Cleaner is not available');
    }

    // Check if cleaner wallet allows new bookings
    if (cleanerService.cleaner.user.wallet) {
      const isBlocked = shouldBlockCleaner(cleanerService.cleaner.user.wallet.balanceMad);
      if (isBlocked) {
        throw new BadRequestException('Cleaner is temporarily unavailable');
      }
    }

    // Calculate pricing
    let basePriceMad = cleanerService.priceMad;
    let addonsTotal = 0;
    let selectedAddons: any[] = [];

    if (bookingData.addonIds && bookingData.addonIds.length > 0) {
      selectedAddons = await this.prisma.serviceAddon.findMany({
        where: {
          id: { in: bookingData.addonIds },
          cleanerServiceId: bookingData.cleanerServiceId,
          active: true,
        },
      });

      addonsTotal = selectedAddons.reduce((total, addon) => total + addon.priceMad, 0);
    }

    const totalPriceMad = basePriceMad + addonsTotal;

    // Create booking with auto-assignment to the cleaner
    const booking = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      const newBooking = await tx.booking.create({
        data: {
          clientUserId,
          cleanerUserId: cleanerService.cleanerUserId,
          cleanerServiceId: bookingData.cleanerServiceId,
          scheduledAt: new Date(bookingData.scheduledAt),
          addressText: bookingData.addressText,
          lat: bookingData.lat,
          lng: bookingData.lng,
          basePriceMad,
          addonsTotal,
          totalPriceMad,
          status: BookingStatus.REQUESTED,
        },
      });

      // Add selected addons
      if (selectedAddons.length > 0) {
        await tx.bookingAddon.createMany({
          data: selectedAddons.map((addon) => ({
            bookingId: newBooking.id,
            serviceAddonId: addon.id,
            priceMad: addon.priceMad,
          })),
        });
      }

      // Create initial booking event
      await tx.bookingEvent.create({
        data: {
          bookingId: newBooking.id,
          actorUserId: clientUserId,
          newStatus: BookingStatus.REQUESTED,
          meta: {
            reference: generateBookingReference(),
            totalAmount: totalPriceMad,
            addonsCount: selectedAddons.length,
          },
        },
      });

      return newBooking;
    });

    // Return booking with all details
    return this.getBookingById(booking.id, clientUserId, UserRole.CLIENT);
  }

  async getBookings(userId: string, role: UserRole, filters?: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, role);

    let whereClause: any = {};

    // Filter by user role
    if (role === UserRole.CLIENT) {
      whereClause.clientUserId = userId;
    } else if (role === UserRole.CLEANER) {
      whereClause.cleanerUserId = userId;
    }
    // Admin can see all bookings (no additional filter)

    // Apply additional filters
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.scheduledAt = {};
      if (filters.dateFrom) whereClause.scheduledAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.scheduledAt.lte = new Date(filters.dateTo);
    }

    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        cleaner: {
          include: {
            cleanerProfile: true,
          },
        },
        cleanerService: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
        addons: {
          include: {
            serviceAddon: true,
          },
        },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return bookings;
  }

  async getBookingById(bookingId: string, userId: string, role: UserRole) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, role);

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        cleaner: {
          include: {
            cleanerProfile: {
              include: {
                liveLocation: true,
              },
            },
          },
        },
        cleanerService: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
            addons: {
              where: { active: true },
            },
            photos: true,
          },
        },
        addons: {
          include: {
            serviceAddon: true,
          },
        },
        events: {
          include: {
            actor: {
              include: {
                clientProfile: true,
                cleanerProfile: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        reviews: true,
        disputes: {
          where: { status: { not: 'RESOLVED' } },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify user has access to this booking
    const hasAccess = 
      role === UserRole.ADMIN ||
      booking.clientUserId === userId ||
      booking.cleanerUserId === userId;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this booking');
    }

    // Calculate distance and ETA if cleaner has location
    let distance, eta;
    if (booking.cleaner?.cleanerProfile?.liveLocation) {
      distance = calculateDistance(
        booking.lat,
        booking.lng,
        booking.cleaner.cleanerProfile.liveLocation.lat,
        booking.cleaner.cleanerProfile.liveLocation.lng
      );
      eta = Math.round((distance / 30) * 60); // 30 km/h average speed
    }

    return {
      ...booking,
      distance,
      eta,
    };
  }

  async updateBookingStatus(bookingId: string, newStatus: BookingStatus, userId: string, role: UserRole, meta?: any) {
    return this.bookingStatusService.updateBookingStatus(bookingId, newStatus, userId, role, meta);
  }

  async assignBookingToCleaner(bookingId: string, cleanerUserId: string, adminUserId: string) {
    // Set admin context for RLS
    await this.prisma.enableRLS(adminUserId, 'ADMIN');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new BadRequestException('Booking is not in requested status');
    }

    // Verify cleaner exists and is available
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
      throw new NotFoundException('Cleaner not found');
    }

    if (!cleaner.active) {
      throw new BadRequestException('Cleaner is not available');
    }

    // Check wallet balance
    if (cleaner.user.wallet && shouldBlockCleaner(cleaner.user.wallet.balanceMad)) {
      throw new BadRequestException('Cleaner wallet balance insufficient');
    }

    // Update booking assignment
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { cleanerUserId },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        cleaner: {
          include: {
            cleanerProfile: true,
          },
        },
      },
    });

    // Log assignment event
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
      await tx.bookingEvent.create({
        data: {
          bookingId,
          actorUserId: adminUserId,
          oldStatus: BookingStatus.REQUESTED,
          newStatus: BookingStatus.REQUESTED, // Status doesn't change, just assignment
          meta: {
            action: 'ASSIGNED',
            cleanerUserId,
            assignedBy: adminUserId,
          },
        },
      });
    });

    return updatedBooking;
  }

  async cancelBooking(bookingId: string, userId: string, role: UserRole, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate cancellation permissions
    if (role === UserRole.CLIENT && booking.clientUserId !== userId) {
      throw new ForbiddenException('Only booking client can cancel');
    }

    if (role === UserRole.CLEANER && booking.cleanerUserId !== userId) {
      throw new ForbiddenException('Only assigned cleaner can cancel');
    }

    // Check if cancellation is allowed based on timing
    const now = new Date();
    const timeDiff = booking.scheduledAt.getTime() - now.getTime();
    const hoursUntilBooking = timeDiff / (1000 * 60 * 60);

    if (hoursUntilBooking < 2 && booking.status !== BookingStatus.REQUESTED) {
      throw new BadRequestException('Cannot cancel booking less than 2 hours before scheduled time');
    }

    return this.updateBookingStatus(
      bookingId,
      BookingStatus.CANCELLED,
      userId,
      role,
      { reason, cancelledBy: role }
    );
  }

  async confirmBooking(bookingId: string, clientUserId: string, reviewData?: any) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        cleaner: {
          include: {
            cleanerProfile: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientUserId !== clientUserId) {
      throw new ForbiddenException('Only booking client can confirm');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Booking must be completed before confirmation');
    }

    // Update booking status to confirmed
    const confirmedBooking = await this.updateBookingStatus(
      bookingId,
      BookingStatus.CLIENT_CONFIRMED,
      clientUserId,
      UserRole.CLIENT,
      { confirmedAt: new Date() }
    );

    // Create review if provided
    if (reviewData && booking.cleanerUserId) {
      await this.createReview(
        bookingId,
        clientUserId,
        booking.cleanerUserId,
        reviewData.rating,
        reviewData.comment
      );
    }

    return confirmedBooking;
  }

  async createReview(bookingId: string, clientUserId: string, cleanerUserId: string, rating: number, comment?: string) {
    // Verify booking is confirmed and client is authorized
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.clientUserId !== clientUserId) {
      throw new ForbiddenException('Unauthorized to review this booking');
    }

    if (booking.status !== BookingStatus.CLIENT_CONFIRMED) {
      throw new BadRequestException('Can only review confirmed bookings');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this booking');
    }

    const review = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      // Create review
      const newReview = await tx.review.create({
        data: {
          bookingId,
          clientUserId,
          cleanerUserId,
          rating,
          comment,
        },
      });

      // Update cleaner's average rating
      const avgRating = await tx.review.aggregate({
        where: { cleanerUserId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.cleanerProfile.update({
        where: { userId: cleanerUserId },
        data: {
          ratingAvg: avgRating._avg.rating || 0,
          ratingCount: avgRating._count.rating || 0,
        },
      });

      return newReview;
    });

    return review;
  }

  // ======================
  // Real-time Tracking
  // ======================

  async getBookingTracking(bookingId: string, userId: string, role: UserRole) {
    const booking = await this.getBookingById(bookingId, userId, role);

    if (!booking.cleaner?.cleanerProfile?.liveLocation) {
      return {
        booking,
        tracking: null,
        message: 'Cleaner location not available',
      };
    }

    const cleanerLocation = booking.cleaner.cleanerProfile.liveLocation;
    
    // Calculate current distance and ETA
    const distance = calculateDistance(
      booking.lat,
      booking.lng,
      cleanerLocation.lat,
      cleanerLocation.lng
    );
    
    const eta = Math.round((distance / 30) * 60); // 30 km/h average speed

    return {
      booking,
      tracking: {
        cleanerLocation: {
          lat: cleanerLocation.lat,
          lng: cleanerLocation.lng,
          updatedAt: cleanerLocation.updatedAt,
        },
        distance,
        eta,
        status: booking.status,
      },
    };
  }

  // ======================
  // Cleaner Dashboard
  // ======================

  async getCleanerBookings(cleanerUserId: string, status?: BookingStatus) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    let whereClause: any = {
      cleanerUserId,
    };

    if (status) {
      whereClause.status = status;
    }

    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
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
        addons: {
          include: {
            serviceAddon: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return bookings;
  }

  async getPendingBookings(cleanerUserId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(cleanerUserId, 'CLEANER');

    // Get bookings that need cleaner action
    const pendingBookings = await this.prisma.booking.findMany({
      where: {
        cleanerUserId,
        status: {
          in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED, BookingStatus.ON_THE_WAY, BookingStatus.ARRIVED],
        },
      },
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
        addons: {
          include: {
            serviceAddon: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return pendingBookings;
  }

  // ======================
  // Admin Functions
  // ======================

  async getBookingAnalytics(dateFrom?: Date, dateTo?: Date) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) whereClause.createdAt.lte = dateTo;
    }

    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      avgBookingValue,
      bookingsByStatus,
      recentBookings,
    ] = await Promise.all([
      this.prisma.booking.count({ where: whereClause }),
      this.prisma.booking.count({ 
        where: { ...whereClause, status: BookingStatus.CLIENT_CONFIRMED } 
      }),
      this.prisma.booking.count({ 
        where: { ...whereClause, status: BookingStatus.CANCELLED } 
      }),
      this.prisma.booking.aggregate({
        where: { ...whereClause, status: BookingStatus.CLIENT_CONFIRMED },
        _avg: { totalPriceMad: true },
      }),
      this.prisma.booking.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { status: true },
      }),
      this.prisma.booking.findMany({
        where: whereClause,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
          cleaner: {
            include: {
              cleanerProfile: true,
            },
          },
          cleanerService: {
            include: {
              service: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      avgBookingValue: avgBookingValue._avg.totalPriceMad || 0,
      bookingsByStatus,
      recentBookings,
    };
  }
}
