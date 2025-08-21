import { z } from 'zod';
import { UserRole, BookingStatus, WalletTransactionType, DisputeStatus, SupportChannel } from '../types';
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    emailVerified: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const clientProfileSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    defaultLocationId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | undefined;
    defaultLocationId?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | undefined;
    defaultLocationId?: string | undefined;
}>;
export declare const cleanerProfileSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    businessName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    ratingAvg: z.ZodNumber;
    ratingCount: z.ZodNumber;
    isVerified: z.ZodBoolean;
    active: z.ZodBoolean;
    baseLocationId: z.ZodOptional<z.ZodString>;
    completedJobsCount: z.ZodNumber;
    freeJobsUsed: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    businessName: string;
    ratingAvg: number;
    ratingCount: number;
    isVerified: boolean;
    active: boolean;
    completedJobsCount: number;
    freeJobsUsed: number;
    bio?: string | undefined;
    baseLocationId?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    businessName: string;
    ratingAvg: number;
    ratingCount: number;
    isVerified: boolean;
    active: boolean;
    completedJobsCount: number;
    freeJobsUsed: number;
    bio?: string | undefined;
    baseLocationId?: string | undefined;
}>;
export declare const locationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    label: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    addressText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    label: string;
    lat: number;
    lng: number;
    addressText: string;
    userId?: string | undefined;
}, {
    id: string;
    label: string;
    lat: number;
    lng: number;
    addressText: string;
    userId?: string | undefined;
}>;
export declare const serviceCategorySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description?: string | undefined;
}, {
    id: string;
    name: string;
    description?: string | undefined;
}>;
export declare const serviceSchema: z.ZodObject<{
    id: z.ZodString;
    categoryId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    baseDurationMin: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    categoryId: string;
    baseDurationMin: number;
    description?: string | undefined;
}, {
    id: string;
    name: string;
    categoryId: string;
    baseDurationMin: number;
    description?: string | undefined;
}>;
export declare const cleanerServiceSchema: z.ZodObject<{
    id: z.ZodString;
    cleanerUserId: z.ZodString;
    serviceId: z.ZodString;
    priceMad: z.ZodNumber;
    active: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    active: boolean;
    cleanerUserId: string;
    serviceId: string;
    priceMad: number;
}, {
    id: string;
    active: boolean;
    cleanerUserId: string;
    serviceId: string;
    priceMad: number;
}>;
export declare const serviceAddonSchema: z.ZodObject<{
    id: z.ZodString;
    cleanerServiceId: z.ZodString;
    name: z.ZodString;
    priceMad: z.ZodNumber;
    extraDurationMin: z.ZodNumber;
    active: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    active: boolean;
    name: string;
    priceMad: number;
    cleanerServiceId: string;
    extraDurationMin: number;
}, {
    id: string;
    active: boolean;
    name: string;
    priceMad: number;
    cleanerServiceId: string;
    extraDurationMin: number;
}>;
export declare const bookingSchema: z.ZodObject<{
    id: z.ZodString;
    clientUserId: z.ZodString;
    cleanerUserId: z.ZodOptional<z.ZodString>;
    cleanerServiceId: z.ZodString;
    scheduledAt: z.ZodDate;
    addressText: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    basePriceMad: z.ZodNumber;
    addonsTotal: z.ZodNumber;
    totalPriceMad: z.ZodNumber;
    status: z.ZodNativeEnum<typeof BookingStatus>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
    lat: number;
    lng: number;
    addressText: string;
    cleanerServiceId: string;
    clientUserId: string;
    scheduledAt: Date;
    basePriceMad: number;
    addonsTotal: number;
    totalPriceMad: number;
    cleanerUserId?: string | undefined;
}, {
    id: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
    lat: number;
    lng: number;
    addressText: string;
    cleanerServiceId: string;
    clientUserId: string;
    scheduledAt: Date;
    basePriceMad: number;
    addonsTotal: number;
    totalPriceMad: number;
    cleanerUserId?: string | undefined;
}>;
export declare const reviewSchema: z.ZodObject<{
    id: z.ZodString;
    bookingId: z.ZodString;
    clientUserId: z.ZodString;
    cleanerUserId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    cleanerUserId: string;
    clientUserId: string;
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    cleanerUserId: string;
    clientUserId: string;
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}>;
export declare const walletSchema: z.ZodObject<{
    ownerUserId: z.ZodString;
    balanceMad: z.ZodNumber;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    updatedAt: Date;
    ownerUserId: string;
    balanceMad: number;
}, {
    updatedAt: Date;
    ownerUserId: string;
    balanceMad: number;
}>;
export declare const walletTransactionSchema: z.ZodObject<{
    id: z.ZodString;
    walletOwnerUserId: z.ZodString;
    type: z.ZodNativeEnum<typeof WalletTransactionType>;
    amountMad: z.ZodNumber;
    bookingId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: WalletTransactionType;
    createdAt: Date;
    walletOwnerUserId: string;
    amountMad: number;
    bookingId?: string | undefined;
    meta?: Record<string, any> | undefined;
}, {
    id: string;
    type: WalletTransactionType;
    createdAt: Date;
    walletOwnerUserId: string;
    amountMad: number;
    bookingId?: string | undefined;
    meta?: Record<string, any> | undefined;
}>;
export declare const registerClientSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string | undefined;
}, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string | undefined;
}>;
export declare const registerCleanerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    businessName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    businessName: string;
    password: string;
    bio?: string | undefined;
}, {
    email: string;
    businessName: string;
    password: string;
    bio?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    code: string;
}, {
    email: string;
    code: string;
}>;
export declare const createBookingSchema: z.ZodObject<{
    cleanerServiceId: z.ZodString;
    scheduledAt: z.ZodString;
    addressText: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    addonIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    lat: number;
    lng: number;
    addressText: string;
    cleanerServiceId: string;
    scheduledAt: string;
    addonIds?: string[] | undefined;
}, {
    lat: number;
    lng: number;
    addressText: string;
    cleanerServiceId: string;
    scheduledAt: string;
    addonIds?: string[] | undefined;
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof BookingStatus>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: BookingStatus;
    meta?: Record<string, any> | undefined;
}, {
    status: BookingStatus;
    meta?: Record<string, any> | undefined;
}>;
export declare const createReviewSchema: z.ZodObject<{
    bookingId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}, {
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}>;
export declare const serviceFiltersSchema: z.ZodObject<{
    serviceType: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    distance: z.ZodOptional<z.ZodNumber>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodBoolean>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
        radius: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
        radius?: number | undefined;
    }, {
        lat: number;
        lng: number;
        radius?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    rating?: number | undefined;
    serviceType?: string | undefined;
    distance?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    availability?: boolean | undefined;
    location?: {
        lat: number;
        lng: number;
        radius?: number | undefined;
    } | undefined;
}, {
    rating?: number | undefined;
    serviceType?: string | undefined;
    distance?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    availability?: boolean | undefined;
    location?: {
        lat: number;
        lng: number;
        radius?: number | undefined;
    } | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const paypalWebhookSchema: z.ZodObject<{
    id: z.ZodString;
    event_type: z.ZodString;
    resource: z.ZodRecord<z.ZodString, z.ZodAny>;
    create_time: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    event_type: string;
    resource: Record<string, any>;
    create_time: string;
}, {
    id: string;
    event_type: string;
    resource: Record<string, any>;
    create_time: string;
}>;
export declare const createSupportTicketSchema: z.ZodObject<{
    subject: z.ZodString;
    message: z.ZodString;
    channel: z.ZodNativeEnum<typeof SupportChannel>;
}, "strip", z.ZodTypeAny, {
    message: string;
    subject: string;
    channel: SupportChannel;
}, {
    message: string;
    subject: string;
    channel: SupportChannel;
}>;
export declare const createDisputeSchema: z.ZodObject<{
    bookingId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    reason: string;
}, {
    bookingId: string;
    reason: string;
}>;
export declare const adminUpdateCleanerVerificationSchema: z.ZodObject<{
    cleanerId: z.ZodString;
    isVerified: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isVerified: boolean;
    cleanerId: string;
    reason?: string | undefined;
}, {
    isVerified: boolean;
    cleanerId: string;
    reason?: string | undefined;
}>;
export declare const adminResolveDisputeSchema: z.ZodObject<{
    disputeId: z.ZodString;
    status: z.ZodNativeEnum<typeof DisputeStatus>;
    resolutionNote: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: DisputeStatus;
    disputeId: string;
    resolutionNote: string;
}, {
    status: DisputeStatus;
    disputeId: string;
    resolutionNote: string;
}>;
//# sourceMappingURL=index.d.ts.map