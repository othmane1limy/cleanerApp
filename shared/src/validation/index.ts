import { z } from 'zod';
import { UserRole, BookingStatus, WalletTransactionType, CommissionStatus, DisputeStatus, SupportChannel, SupportTicketStatus } from '../types';

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const clientProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  defaultLocationId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const cleanerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  businessName: z.string().min(1).max(200),
  bio: z.string().max(1000).optional(),
  ratingAvg: z.number().min(0).max(5),
  ratingCount: z.number().int().min(0),
  isVerified: z.boolean(),
  active: z.boolean(),
  baseLocationId: z.string().uuid().optional(),
  completedJobsCount: z.number().int().min(0),
  freeJobsUsed: z.number().int().min(0).max(20),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Location validation schemas
export const locationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  label: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  addressText: z.string().min(1),
});

// Service validation schemas
export const serviceCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

export const serviceSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  baseDurationMin: z.number().int().min(15).max(480), // 15 minutes to 8 hours
});

export const cleanerServiceSchema = z.object({
  id: z.string().uuid(),
  cleanerUserId: z.string().uuid(),
  serviceId: z.string().uuid(),
  priceMad: z.number().min(0).max(9999.99),
  active: z.boolean(),
});

export const serviceAddonSchema = z.object({
  id: z.string().uuid(),
  cleanerServiceId: z.string().uuid(),
  name: z.string().min(1).max(200),
  priceMad: z.number().min(0).max(9999.99),
  extraDurationMin: z.number().int().min(0).max(240), // Up to 4 hours extra
  active: z.boolean(),
});

// Booking validation schemas
export const bookingSchema = z.object({
  id: z.string().uuid(),
  clientUserId: z.string().uuid(),
  cleanerUserId: z.string().uuid().optional(),
  cleanerServiceId: z.string().uuid(),
  scheduledAt: z.date(),
  addressText: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  basePriceMad: z.number().min(0).max(99999.99),
  addonsTotal: z.number().min(0).max(99999.99),
  totalPriceMad: z.number().min(0).max(99999.99),
  status: z.nativeEnum(BookingStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  clientUserId: z.string().uuid(),
  cleanerUserId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  createdAt: z.date(),
});

// Wallet validation schemas
export const walletSchema = z.object({
  ownerUserId: z.string().uuid(),
  balanceMad: z.number().min(-99999.99).max(99999.99),
  updatedAt: z.date(),
});

export const walletTransactionSchema = z.object({
  id: z.string().uuid(),
  walletOwnerUserId: z.string().uuid(),
  type: z.nativeEnum(WalletTransactionType),
  amountMad: z.number().min(-99999.99).max(99999.99),
  bookingId: z.string().uuid().optional(),
  createdAt: z.date(),
  meta: z.record(z.any()).optional(),
});

// API validation schemas
export const registerClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(10).max(20).optional(),
});

export const registerCleanerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  businessName: z.string().min(1).max(200),
  bio: z.string().max(1000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const createBookingSchema = z.object({
  cleanerServiceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  addressText: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  addonIds: z.array(z.string().uuid()).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  meta: z.record(z.any()).optional(),
});

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const serviceFiltersSchema = z.object({
  serviceType: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  distance: z.number().min(0).max(100).optional(), // Max 100km
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  availability: z.boolean().optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    radius: z.number().min(0).max(100).optional(),
  }).optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// PayPal webhook validation
export const paypalWebhookSchema = z.object({
  id: z.string(),
  event_type: z.string(),
  resource: z.record(z.any()),
  create_time: z.string(),
});

// Support validation schemas
export const createSupportTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  channel: z.nativeEnum(SupportChannel),
});

export const createDisputeSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(1).max(1000),
});

// Admin validation schemas
export const adminUpdateCleanerVerificationSchema = z.object({
  cleanerId: z.string().uuid(),
  isVerified: z.boolean(),
  reason: z.string().max(500).optional(),
});

export const adminResolveDisputeSchema = z.object({
  disputeId: z.string().uuid(),
  status: z.nativeEnum(DisputeStatus),
  resolutionNote: z.string().max(1000),
});
