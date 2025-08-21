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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const booking_status_service_1 = require("./booking-status.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const shared_1 = require("@cleaning-marketplace/shared");
let BookingsController = class BookingsController {
    bookingsService;
    bookingStatusService;
    constructor(bookingsService, bookingStatusService) {
        this.bookingsService = bookingsService;
        this.bookingStatusService = bookingStatusService;
    }
    async createBooking(req, bookingData) {
        return this.bookingsService.createBooking(req.user.id, bookingData);
    }
    async getBookings(req, filters) {
        return this.bookingsService.getBookings(req.user.id, req.user.role, filters);
    }
    async getBookingById(req, bookingId) {
        return this.bookingsService.getBookingById(bookingId, req.user.id, req.user.role);
    }
    async updateBookingStatus(req, bookingId, body) {
        return this.bookingsService.updateBookingStatus(bookingId, body.status, req.user.id, req.user.role, body.meta);
    }
    async confirmBooking(req, bookingId, reviewData) {
        return this.bookingsService.confirmBooking(bookingId, req.user.id, reviewData);
    }
    async cancelBooking(req, bookingId, body) {
        return this.bookingsService.cancelBooking(bookingId, req.user.id, req.user.role, body?.reason);
    }
    async getBookingTracking(req, bookingId) {
        return this.bookingsService.getBookingTracking(bookingId, req.user.id, req.user.role);
    }
    async getBookingHistory(req, bookingId) {
        return this.bookingStatusService.getBookingStatusHistory(bookingId);
    }
    async getPendingBookings(req) {
        return this.bookingsService.getPendingBookings(req.user.id);
    }
    async getCleanerBookings(req, status) {
        return this.bookingsService.getCleanerBookings(req.user.id, status);
    }
    async assignBooking(req, bookingId, body) {
        return this.bookingsService.assignBookingToCleaner(bookingId, body.cleanerUserId, req.user.id);
    }
    async getBookingAnalytics(dateFrom, dateTo) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.bookingsService.getBookingAnalytics(from, to);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid booking data or cleaner unavailable' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service or cleaner not found' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                cleanerServiceId: { type: 'string' },
                scheduledAt: { type: 'string', format: 'date-time' },
                addressText: { type: 'string' },
                lat: { type: 'number', minimum: -90, maximum: 90 },
                lng: { type: 'number', minimum: -180, maximum: 180 },
                addonIds: { type: 'array', items: { type: 'string' } },
            },
            required: ['cleanerServiceId', 'scheduledAt', 'addressText', 'lat', 'lng'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookings retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: shared_1.BookingStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)(':bookingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Put)(':bookingId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: Object.values(shared_1.BookingStatus) },
                meta: { type: 'object' },
            },
            required: ['status'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Post)(':bookingId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm completed booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Booking not completed or already confirmed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only client can confirm' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                rating: { type: 'number', minimum: 1, maximum: 5 },
                comment: { type: 'string', maxLength: 1000 },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Post)(':bookingId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot cancel booking at this time' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                reason: { type: 'string', maxLength: 500 },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)(':bookingId/track'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time booking tracking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tracking data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingTracking", null);
__decorate([
    (0, common_1.Get)(':bookingId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking status history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingHistory", null);
__decorate([
    (0, common_1.Get)('cleaner/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending bookings for cleaner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending bookings retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getPendingBookings", null);
__decorate([
    (0, common_1.Get)('cleaner/my-bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaner bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookings retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: shared_1.BookingStatus }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getCleanerBookings", null);
__decorate([
    (0, common_1.Post)(':bookingId/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign booking to cleaner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid assignment or cleaner unavailable' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking or cleaner not found' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                cleanerUserId: { type: 'string' },
            },
            required: ['cleanerUserId'],
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "assignBooking", null);
__decorate([
    (0, common_1.Get)('admin/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingAnalytics", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        booking_status_service_1.BookingStatusService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map