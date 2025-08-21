"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResolveDisputeSchema = exports.adminUpdateCleanerVerificationSchema = exports.createDisputeSchema = exports.createSupportTicketSchema = exports.paypalWebhookSchema = exports.paginationSchema = exports.serviceFiltersSchema = exports.createReviewSchema = exports.updateBookingStatusSchema = exports.createBookingSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerCleanerSchema = exports.registerClientSchema = exports.walletTransactionSchema = exports.walletSchema = exports.reviewSchema = exports.bookingSchema = exports.serviceAddonSchema = exports.cleanerServiceSchema = exports.serviceSchema = exports.serviceCategorySchema = exports.locationSchema = exports.cleanerProfileSchema = exports.clientProfileSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// User validation schemas
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    role: zod_1.z.nativeEnum(types_1.UserRole),
    emailVerified: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.clientProfileSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    avatarUrl: zod_1.z.string().url().optional(),
    defaultLocationId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.cleanerProfileSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    businessName: zod_1.z.string().min(1).max(200),
    bio: zod_1.z.string().max(1000).optional(),
    ratingAvg: zod_1.z.number().min(0).max(5),
    ratingCount: zod_1.z.number().int().min(0),
    isVerified: zod_1.z.boolean(),
    active: zod_1.z.boolean(),
    baseLocationId: zod_1.z.string().uuid().optional(),
    completedJobsCount: zod_1.z.number().int().min(0),
    freeJobsUsed: zod_1.z.number().int().min(0).max(20),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Location validation schemas
exports.locationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid().optional(),
    label: zod_1.z.string().min(1).max(200),
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    addressText: zod_1.z.string().min(1),
});
// Service validation schemas
exports.serviceCategorySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
});
exports.serviceSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    categoryId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    baseDurationMin: zod_1.z.number().int().min(15).max(480), // 15 minutes to 8 hours
});
exports.cleanerServiceSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cleanerUserId: zod_1.z.string().uuid(),
    serviceId: zod_1.z.string().uuid(),
    priceMad: zod_1.z.number().min(0).max(9999.99),
    active: zod_1.z.boolean(),
});
exports.serviceAddonSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cleanerServiceId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(200),
    priceMad: zod_1.z.number().min(0).max(9999.99),
    extraDurationMin: zod_1.z.number().int().min(0).max(240), // Up to 4 hours extra
    active: zod_1.z.boolean(),
});
// Booking validation schemas
exports.bookingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    clientUserId: zod_1.z.string().uuid(),
    cleanerUserId: zod_1.z.string().uuid().optional(),
    cleanerServiceId: zod_1.z.string().uuid(),
    scheduledAt: zod_1.z.date(),
    addressText: zod_1.z.string().min(1),
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    basePriceMad: zod_1.z.number().min(0).max(99999.99),
    addonsTotal: zod_1.z.number().min(0).max(99999.99),
    totalPriceMad: zod_1.z.number().min(0).max(99999.99),
    status: zod_1.z.nativeEnum(types_1.BookingStatus),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.reviewSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    bookingId: zod_1.z.string().uuid(),
    clientUserId: zod_1.z.string().uuid(),
    cleanerUserId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(1000).optional(),
    createdAt: zod_1.z.date(),
});
// Wallet validation schemas
exports.walletSchema = zod_1.z.object({
    ownerUserId: zod_1.z.string().uuid(),
    balanceMad: zod_1.z.number().min(-99999.99).max(99999.99),
    updatedAt: zod_1.z.date(),
});
exports.walletTransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    walletOwnerUserId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(types_1.WalletTransactionType),
    amountMad: zod_1.z.number().min(-99999.99).max(99999.99),
    bookingId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.date(),
    meta: zod_1.z.record(zod_1.z.any()).optional(),
});
// API validation schemas
exports.registerClientSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    phone: zod_1.z.string().min(10).max(20).optional(),
});
exports.registerCleanerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
    businessName: zod_1.z.string().min(1).max(200),
    bio: zod_1.z.string().max(1000).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().length(6),
});
exports.createBookingSchema = zod_1.z.object({
    cleanerServiceId: zod_1.z.string().uuid(),
    scheduledAt: zod_1.z.string().datetime(),
    addressText: zod_1.z.string().min(1),
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    addonIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(types_1.BookingStatus),
    meta: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.createReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(1000).optional(),
});
exports.serviceFiltersSchema = zod_1.z.object({
    serviceType: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    distance: zod_1.z.number().min(0).max(100).optional(), // Max 100km
    minPrice: zod_1.z.number().min(0).optional(),
    maxPrice: zod_1.z.number().min(0).optional(),
    availability: zod_1.z.boolean().optional(),
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
        radius: zod_1.z.number().min(0).max(100).optional(),
    }).optional(),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
});
// PayPal webhook validation
exports.paypalWebhookSchema = zod_1.z.object({
    id: zod_1.z.string(),
    event_type: zod_1.z.string(),
    resource: zod_1.z.record(zod_1.z.any()),
    create_time: zod_1.z.string(),
});
// Support validation schemas
exports.createSupportTicketSchema = zod_1.z.object({
    subject: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().min(1).max(2000),
    channel: zod_1.z.nativeEnum(types_1.SupportChannel),
});
exports.createDisputeSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().min(1).max(1000),
});
// Admin validation schemas
exports.adminUpdateCleanerVerificationSchema = zod_1.z.object({
    cleanerId: zod_1.z.string().uuid(),
    isVerified: zod_1.z.boolean(),
    reason: zod_1.z.string().max(500).optional(),
});
exports.adminResolveDisputeSchema = zod_1.z.object({
    disputeId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(types_1.DisputeStatus),
    resolutionNote: zod_1.z.string().max(1000),
});
