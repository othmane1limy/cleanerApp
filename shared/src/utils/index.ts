// Utility functions for the platform

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate commission amount based on job completion and free job quota
 */
export function calculateCommission(
  jobPrice: number,
  completedJobs: number,
  freeJobsQuota = 20,
  commissionRate = 0.07
): { commissionAmount: number; isFreeJob: boolean } {
  const isFreeJob = completedJobs < freeJobsQuota;
  const commissionAmount = isFreeJob ? 0 : jobPrice * commissionRate;
  
  return {
    commissionAmount,
    isFreeJob,
  };
}

/**
 * Format currency in MAD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
}

/**
 * Format distance with appropriate unit
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Estimate time of arrival based on distance
 */
export function estimateETA(distanceKm: number, averageSpeedKmh = 30): number {
  return Math.round((distanceKm / averageSpeedKmh) * 60); // Returns minutes
}

/**
 * Format ETA in human readable format
 */
export function formatETA(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle Moroccan phone numbers
  if (digits.startsWith('212')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+212${digits.slice(1)}`;
  } else if (digits.length === 9) {
    return `+212${digits}`;
  }
  
  return `+${digits}`;
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if a booking can be cancelled based on timing
 */
export function canCancelBooking(scheduledAt: Date, currentTime = new Date()): boolean {
  const timeUntilBooking = scheduledAt.getTime() - currentTime.getTime();
  const hoursUntilBooking = timeUntilBooking / (1000 * 60 * 60);
  
  // Can cancel if booking is more than 2 hours away
  return hoursUntilBooking > 2;
}

/**
 * Check if a cleaner should be blocked due to debt
 */
export function shouldBlockCleaner(walletBalance: number, debtLimit = -200): boolean {
  return walletBalance < debtLimit;
}

/**
 * Create a slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mask email for privacy
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.slice(0, 2)}***@${domain}`;
}

/**
 * Check if time is within business hours
 */
export function isWithinBusinessHours(
  time: Date,
  startHour = 8,
  endHour = 18
): boolean {
  const hour = time.getHours();
  return hour >= startHour && hour < endHour;
}

/**
 * Generate booking reference number
 */
export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BK-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
}
