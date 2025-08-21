// User and Profile Types
export enum UserRole {
  CLIENT = 'CLIENT',
  CLEANER = 'CLEANER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  defaultLocationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CleanerProfile {
  id: string;
  userId: string;
  businessName: string;
  bio?: string;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  active: boolean;
  baseLocationId?: string;
  completedJobsCount: number;
  freeJobsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  baseDurationMin: number;
  category?: ServiceCategory;
}

export interface CleanerService {
  id: string;
  cleanerUserId: string;
  serviceId: string;
  priceMad: number;
  active: boolean;
  service?: Service;
  addons?: ServiceAddon[];
}

export interface ServiceAddon {
  id: string;
  cleanerServiceId: string;
  name: string;
  priceMad: number;
  extraDurationMin: number;
  active: boolean;
}

// Location Types
export interface Location {
  id: string;
  userId?: string;
  label: string;
  lat: number;
  lng: number;
  addressText: string;
}

export interface CleanerLiveLocation {
  cleanerUserId: string;
  lat: number;
  lng: number;
  updatedAt: Date;
}

// Booking Types
export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ON_THE_WAY = 'ON_THE_WAY',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLIENT_CONFIRMED = 'CLIENT_CONFIRMED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export interface Booking {
  id: string;
  clientUserId: string;
  cleanerUserId?: string;
  cleanerServiceId: string;
  scheduledAt: Date;
  addressText: string;
  lat: number;
  lng: number;
  basePriceMad: number;
  addonsTotal: number;
  totalPriceMad: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  client?: User;
  cleaner?: User;
  cleanerService?: CleanerService;
  addons?: BookingAddon[];
  reviews?: Review[];
  events?: BookingEvent[];
}

export interface BookingAddon {
  bookingId: string;
  serviceAddonId: string;
  priceMad: number;
  serviceAddon?: ServiceAddon;
}

export interface BookingEvent {
  id: string;
  bookingId: string;
  actorUserId: string;
  oldStatus?: BookingStatus;
  newStatus: BookingStatus;
  createdAt: Date;
  meta?: Record<string, any>;
}

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  clientUserId: string;
  cleanerUserId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// Wallet and Payment Types
export interface Wallet {
  ownerUserId: string;
  balanceMad: number;
  updatedAt: Date;
}

export enum WalletTransactionType {
  RECHARGE = 'RECHARGE',
  COMMISSION = 'COMMISSION',
  ADJUSTMENT = 'ADJUSTMENT',
  PAYOUT = 'PAYOUT',
}

export interface WalletTransaction {
  id: string;
  walletOwnerUserId: string;
  type: WalletTransactionType;
  amountMad: number; // Can be negative for debits
  bookingId?: string;
  createdAt: Date;
  meta?: Record<string, any>;
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
}

export interface Commission {
  id: string;
  cleanerUserId: string;
  bookingId: string;
  percentage: number;
  commissionMad: number;
  status: CommissionStatus;
  createdAt: Date;
}

export interface DebtThreshold {
  id: string;
  cleanerUserId: string;
  debtLimitMad: number; // Default: -200
}

// Support and Fraud Types
export enum DisputeStatus {
  OPEN = 'OPEN',
  NEEDS_INFO = 'NEEDS_INFO',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

// Verification Types
export enum VerificationDocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Dispute {
  id: string;
  bookingId: string;
  openedByUserId: string;
  reason: string;
  status: DisputeStatus;
  createdAt: Date;
  resolvedAt?: Date;
  resolutionNote?: string;
}

export enum SupportChannel {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  CALL = 'CALL',
  FORM = 'FORM',
}

export enum SupportTicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  channel: SupportChannel;
  status: SupportTicketStatus;
  createdAt: Date;
}

export interface FraudFlag {
  id: string;
  userId: string;
  type: string;
  severity: string;
  reason: string;
  createdAt: Date;
}

// Auth Types
export interface EmailOTP {
  id: string;
  userId: string;
  codeHash: string;
  expiresAt: Date;
  consumedAt?: Date;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
}

export interface Device {
  id: string;
  userId: string;
  platform: string;
  pushToken?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search and Filter Types
export interface ServiceFilters {
  serviceType?: string;
  rating?: number;
  distance?: number;
  minPrice?: number;
  maxPrice?: number;
  availability?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius?: number; // in km
  };
}

export interface ServiceSearchResult {
  cleaner: CleanerProfile;
  services: CleanerService[];
  distance?: number;
  eta?: number;
}
