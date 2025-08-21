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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_status_service_1 = require("./booking-status.service");
const shared_1 = require("@cleaning-marketplace/shared");
const shared_2 = require("@cleaning-marketplace/shared");
let BookingsService = class BookingsService {
    prisma;
    bookingStatusService;
    constructor(prisma, bookingStatusService) {
        this.prisma = prisma;
        this.bookingStatusService = bookingStatusService;
    }
    async createBooking(clientUserId, bookingData) {
        await this.prisma.enableRLS(clientUserId, 'CLIENT');
        const client = await this.prisma.clientProfile.findUnique({
            where: { userId: clientUserId },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client profile not found');
        }
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
            throw new common_1.NotFoundException('Service not found');
        }
        if (!cleanerService.active) {
            throw new common_1.BadRequestException('Service is not available');
        }
        if (!cleanerService.cleaner.active) {
            throw new common_1.BadRequestException('Cleaner is not available');
        }
        if (cleanerService.cleaner.user.wallet) {
            const isBlocked = (0, shared_2.shouldBlockCleaner)(cleanerService.cleaner.user.wallet.balanceMad);
            if (isBlocked) {
                throw new common_1.BadRequestException('Cleaner is temporarily unavailable');
            }
        }
        let basePriceMad = cleanerService.priceMad;
        let addonsTotal = 0;
        let selectedAddons = [];
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
        const booking = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
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
                    status: shared_1.BookingStatus.REQUESTED,
                },
            });
            if (selectedAddons.length > 0) {
                await tx.bookingAddon.createMany({
                    data: selectedAddons.map((addon) => ({
                        bookingId: newBooking.id,
                        serviceAddonId: addon.id,
                        priceMad: addon.priceMad,
                    })),
                });
            }
            await tx.bookingEvent.create({
                data: {
                    bookingId: newBooking.id,
                    actorUserId: clientUserId,
                    newStatus: shared_1.BookingStatus.REQUESTED,
                    meta: {
                        reference: (0, shared_2.generateBookingReference)(),
                        totalAmount: totalPriceMad,
                        addonsCount: selectedAddons.length,
                    },
                },
            });
            return newBooking;
        });
        return this.getBookingById(booking.id, clientUserId, shared_1.UserRole.CLIENT);
    }
    async getBookings(userId, role, filters) {
        await this.prisma.enableRLS(userId, role);
        let whereClause = {};
        if (role === shared_1.UserRole.CLIENT) {
            whereClause.clientUserId = userId;
        }
        else if (role === shared_1.UserRole.CLEANER) {
            whereClause.cleanerUserId = userId;
        }
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.scheduledAt = {};
            if (filters.dateFrom)
                whereClause.scheduledAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                whereClause.scheduledAt.lte = new Date(filters.dateTo);
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
    async getBookingById(bookingId, userId, role) {
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
            throw new common_1.NotFoundException('Booking not found');
        }
        const hasAccess = role === shared_1.UserRole.ADMIN ||
            booking.clientUserId === userId ||
            booking.cleanerUserId === userId;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied to this booking');
        }
        let distance, eta;
        if (booking.cleaner?.cleanerProfile?.liveLocation) {
            distance = (0, shared_2.calculateDistance)(booking.lat, booking.lng, booking.cleaner.cleanerProfile.liveLocation.lat, booking.cleaner.cleanerProfile.liveLocation.lng);
            eta = Math.round((distance / 30) * 60);
        }
        return {
            ...booking,
            distance,
            eta,
        };
    }
    async updateBookingStatus(bookingId, newStatus, userId, role, meta) {
        return this.bookingStatusService.updateBookingStatus(bookingId, newStatus, userId, role, meta);
    }
    async assignBookingToCleaner(bookingId, cleanerUserId, adminUserId) {
        await this.prisma.enableRLS(adminUserId, 'ADMIN');
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== shared_1.BookingStatus.REQUESTED) {
            throw new common_1.BadRequestException('Booking is not in requested status');
        }
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
            throw new common_1.NotFoundException('Cleaner not found');
        }
        if (!cleaner.active) {
            throw new common_1.BadRequestException('Cleaner is not available');
        }
        if (cleaner.user.wallet && (0, shared_2.shouldBlockCleaner)(cleaner.user.wallet.balanceMad)) {
            throw new common_1.BadRequestException('Cleaner wallet balance insufficient');
        }
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
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.bookingEvent.create({
                data: {
                    bookingId,
                    actorUserId: adminUserId,
                    oldStatus: shared_1.BookingStatus.REQUESTED,
                    newStatus: shared_1.BookingStatus.REQUESTED,
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
    async cancelBooking(bookingId, userId, role, reason) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (role === shared_1.UserRole.CLIENT && booking.clientUserId !== userId) {
            throw new common_1.ForbiddenException('Only booking client can cancel');
        }
        if (role === shared_1.UserRole.CLEANER && booking.cleanerUserId !== userId) {
            throw new common_1.ForbiddenException('Only assigned cleaner can cancel');
        }
        const now = new Date();
        const timeDiff = booking.scheduledAt.getTime() - now.getTime();
        const hoursUntilBooking = timeDiff / (1000 * 60 * 60);
        if (hoursUntilBooking < 2 && booking.status !== shared_1.BookingStatus.REQUESTED) {
            throw new common_1.BadRequestException('Cannot cancel booking less than 2 hours before scheduled time');
        }
        return this.updateBookingStatus(bookingId, shared_1.BookingStatus.CANCELLED, userId, role, { reason, cancelledBy: role });
    }
    async confirmBooking(bookingId, clientUserId, reviewData) {
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientUserId !== clientUserId) {
            throw new common_1.ForbiddenException('Only booking client can confirm');
        }
        if (booking.status !== shared_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Booking must be completed before confirmation');
        }
        const confirmedBooking = await this.updateBookingStatus(bookingId, shared_1.BookingStatus.CLIENT_CONFIRMED, clientUserId, shared_1.UserRole.CLIENT, { confirmedAt: new Date() });
        if (reviewData && booking.cleanerUserId) {
            await this.createReview(bookingId, clientUserId, booking.cleanerUserId, reviewData.rating, reviewData.comment);
        }
        return confirmedBooking;
    }
    async createReview(bookingId, clientUserId, cleanerUserId, rating, comment) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking || booking.clientUserId !== clientUserId) {
            throw new common_1.ForbiddenException('Unauthorized to review this booking');
        }
        if (booking.status !== shared_1.BookingStatus.CLIENT_CONFIRMED) {
            throw new common_1.BadRequestException('Can only review confirmed bookings');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: { bookingId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Review already exists for this booking');
        }
        const review = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            const newReview = await tx.review.create({
                data: {
                    bookingId,
                    clientUserId,
                    cleanerUserId,
                    rating,
                    comment,
                },
            });
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
    async getBookingTracking(bookingId, userId, role) {
        const booking = await this.getBookingById(bookingId, userId, role);
        if (!booking.cleaner?.cleanerProfile?.liveLocation) {
            return {
                booking,
                tracking: null,
                message: 'Cleaner location not available',
            };
        }
        const cleanerLocation = booking.cleaner.cleanerProfile.liveLocation;
        const distance = (0, shared_2.calculateDistance)(booking.lat, booking.lng, cleanerLocation.lat, cleanerLocation.lng);
        const eta = Math.round((distance / 30) * 60);
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
    async getCleanerBookings(cleanerUserId, status) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        let whereClause = {
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
    async getPendingBookings(cleanerUserId) {
        await this.prisma.enableRLS(cleanerUserId, 'CLEANER');
        const pendingBookings = await this.prisma.booking.findMany({
            where: {
                cleanerUserId,
                status: {
                    in: [shared_1.BookingStatus.REQUESTED, shared_1.BookingStatus.ACCEPTED, shared_1.BookingStatus.ON_THE_WAY, shared_1.BookingStatus.ARRIVED],
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
    async getBookingAnalytics(dateFrom, dateTo) {
        const whereClause = {};
        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom)
                whereClause.createdAt.gte = dateFrom;
            if (dateTo)
                whereClause.createdAt.lte = dateTo;
        }
        const [totalBookings, completedBookings, cancelledBookings, avgBookingValue, bookingsByStatus, recentBookings,] = await Promise.all([
            this.prisma.booking.count({ where: whereClause }),
            this.prisma.booking.count({
                where: { ...whereClause, status: shared_1.BookingStatus.CLIENT_CONFIRMED }
            }),
            this.prisma.booking.count({
                where: { ...whereClause, status: shared_1.BookingStatus.CANCELLED }
            }),
            this.prisma.booking.aggregate({
                where: { ...whereClause, status: shared_1.BookingStatus.CLIENT_CONFIRMED },
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_status_service_1.BookingStatusService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map