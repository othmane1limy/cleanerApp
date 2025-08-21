"use strict";
// Utility functions for the platform
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.calculateDistance = calculateDistance;
exports.calculateCommission = calculateCommission;
exports.formatCurrency = formatCurrency;
exports.formatDistance = formatDistance;
exports.estimateETA = estimateETA;
exports.formatETA = formatETA;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.generateSecureToken = generateSecureToken;
exports.canCancelBooking = canCancelBooking;
exports.shouldBlockCleaner = shouldBlockCleaner;
exports.createSlug = createSlug;
exports.maskEmail = maskEmail;
exports.isWithinBusinessHours = isWithinBusinessHours;
exports.generateBookingReference = generateBookingReference;
/**
 * Generate a 6-digit OTP code
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * Calculate commission amount based on job completion and free job quota
 */
function calculateCommission(jobPrice, completedJobs, freeJobsQuota = 20, commissionRate = 0.07) {
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
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-MA', {
        style: 'currency',
        currency: 'MAD',
    }).format(amount);
}
/**
 * Format distance with appropriate unit
 */
function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
}
/**
 * Estimate time of arrival based on distance
 */
function estimateETA(distanceKm, averageSpeedKmh = 30) {
    return Math.round((distanceKm / averageSpeedKmh) * 60); // Returns minutes
}
/**
 * Format ETA in human readable format
 */
function formatETA(minutes) {
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
function sanitizePhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Handle Moroccan phone numbers
    if (digits.startsWith('212')) {
        return `+${digits}`;
    }
    else if (digits.startsWith('0')) {
        return `+212${digits.slice(1)}`;
    }
    else if (digits.length === 9) {
        return `+212${digits}`;
    }
    return `+${digits}`;
}
/**
 * Generate a secure random token
 */
function generateSecureToken(length = 32) {
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
function canCancelBooking(scheduledAt, currentTime = new Date()) {
    const timeUntilBooking = scheduledAt.getTime() - currentTime.getTime();
    const hoursUntilBooking = timeUntilBooking / (1000 * 60 * 60);
    // Can cancel if booking is more than 2 hours away
    return hoursUntilBooking > 2;
}
/**
 * Check if a cleaner should be blocked due to debt
 */
function shouldBlockCleaner(walletBalance, debtLimit = -200) {
    return walletBalance < debtLimit;
}
/**
 * Create a slug from text
 */
function createSlug(text) {
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
function maskEmail(email) {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
        return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 2)}***@${domain}`;
}
/**
 * Check if time is within business hours
 */
function isWithinBusinessHours(time, startHour = 8, endHour = 18) {
    const hour = time.getHours();
    return hour >= startHour && hour < endHour;
}
/**
 * Generate booking reference number
 */
function generateBookingReference() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BK-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
}
