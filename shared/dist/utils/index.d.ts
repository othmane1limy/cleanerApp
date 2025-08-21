/**
 * Generate a 6-digit OTP code
 */
export declare function generateOTP(): string;
/**
 * Calculate distance between two coordinates using Haversine formula
 */
export declare function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
/**
 * Calculate commission amount based on job completion and free job quota
 */
export declare function calculateCommission(jobPrice: number, completedJobs: number, freeJobsQuota?: number, commissionRate?: number): {
    commissionAmount: number;
    isFreeJob: boolean;
};
/**
 * Format currency in MAD
 */
export declare function formatCurrency(amount: number): string;
/**
 * Format distance with appropriate unit
 */
export declare function formatDistance(distanceKm: number): string;
/**
 * Estimate time of arrival based on distance
 */
export declare function estimateETA(distanceKm: number, averageSpeedKmh?: number): number;
/**
 * Format ETA in human readable format
 */
export declare function formatETA(minutes: number): string;
/**
 * Validate and sanitize phone number
 */
export declare function sanitizePhoneNumber(phone: string): string;
/**
 * Generate a secure random token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Check if a booking can be cancelled based on timing
 */
export declare function canCancelBooking(scheduledAt: Date, currentTime?: Date): boolean;
/**
 * Check if a cleaner should be blocked due to debt
 */
export declare function shouldBlockCleaner(walletBalance: number, debtLimit?: number): boolean;
/**
 * Create a slug from text
 */
export declare function createSlug(text: string): string;
/**
 * Mask email for privacy
 */
export declare function maskEmail(email: string): string;
/**
 * Check if time is within business hours
 */
export declare function isWithinBusinessHours(time: Date, startHour?: number, endHour?: number): boolean;
/**
 * Generate booking reference number
 */
export declare function generateBookingReference(): string;
//# sourceMappingURL=index.d.ts.map