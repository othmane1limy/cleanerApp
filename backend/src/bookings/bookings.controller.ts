import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { BookingStatusService } from './booking-status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guard';
import { UserRole, BookingStatus } from '@cleaning-marketplace/shared';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly bookingStatusService: BookingStatusService,
  ) {}

  // ======================
  // Client Booking Operations
  // ======================

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking data or cleaner unavailable' })
  @ApiResponse({ status: 404, description: 'Service or cleaner not found' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  @ApiBody({
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
  })
  async createBooking(@Request() req: any, @Body() bookingData: any) {
    return this.bookingsService.createBooking(req.user.id, bookingData);
  }

  @Get()
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getBookings(@Request() req: any, @Query() filters: any) {
    return this.bookingsService.getBookings(req.user.id, req.user.role, filters);
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getBookingById(@Request() req: any, @Param('bookingId') bookingId: string) {
    return this.bookingsService.getBookingById(bookingId, req.user.id, req.user.role);
  }

  @Put(':bookingId/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(BookingStatus) },
        meta: { type: 'object' },
      },
      required: ['status'],
    },
  })
  async updateBookingStatus(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body: { status: BookingStatus; meta?: any }
  ) {
    return this.bookingsService.updateBookingStatus(
      bookingId,
      body.status,
      req.user.id,
      req.user.role,
      body.meta
    );
  }

  @Post(':bookingId/confirm')
  @ApiOperation({ summary: 'Confirm completed booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Booking not completed or already confirmed' })
  @ApiResponse({ status: 403, description: 'Only client can confirm' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string', maxLength: 1000 },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async confirmBooking(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() reviewData?: { rating?: number; comment?: string }
  ) {
    return this.bookingsService.confirmBooking(bookingId, req.user.id, reviewData);
  }

  @Post(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking at this time' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', maxLength: 500 },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async cancelBooking(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body?: { reason?: string }
  ) {
    return this.bookingsService.cancelBooking(bookingId, req.user.id, req.user.role, body?.reason);
  }

  // ======================
  // Real-time Tracking
  // ======================

  @Get(':bookingId/track')
  @ApiOperation({ summary: 'Get real-time booking tracking' })
  @ApiResponse({ status: 200, description: 'Tracking data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getBookingTracking(@Request() req: any, @Param('bookingId') bookingId: string) {
    return this.bookingsService.getBookingTracking(bookingId, req.user.id, req.user.role);
  }

  @Get(':bookingId/history')
  @ApiOperation({ summary: 'Get booking status history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getBookingHistory(@Request() req: any, @Param('bookingId') bookingId: string) {
    return this.bookingStatusService.getBookingStatusHistory(bookingId);
  }

  // ======================
  // Cleaner-Specific Operations
  // ======================

  @Get('cleaner/pending')
  @ApiOperation({ summary: 'Get pending bookings for cleaner' })
  @ApiResponse({ status: 200, description: 'Pending bookings retrieved successfully' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  async getPendingBookings(@Request() req: any) {
    return this.bookingsService.getPendingBookings(req.user.id);
  }

  @Get('cleaner/my-bookings')
  @ApiOperation({ summary: 'Get cleaner bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  async getCleanerBookings(@Request() req: any, @Query('status') status?: BookingStatus) {
    return this.bookingsService.getCleanerBookings(req.user.id, status);
  }

  // ======================
  // Admin Operations
  // ======================

  @Post(':bookingId/assign')
  @ApiOperation({ summary: 'Assign booking to cleaner' })
  @ApiResponse({ status: 200, description: 'Booking assigned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid assignment or cleaner unavailable' })
  @ApiResponse({ status: 404, description: 'Booking or cleaner not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cleanerUserId: { type: 'string' },
      },
      required: ['cleanerUserId'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async assignBooking(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body: { cleanerUserId: string }
  ) {
    return this.bookingsService.assignBookingToCleaner(bookingId, body.cleanerUserId, req.user.id);
  }

  @Get('admin/analytics')
  @ApiOperation({ summary: 'Get booking analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getBookingAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const from = dateFrom ? new Date(dateFrom) : undefined;
    const to = dateTo ? new Date(dateTo) : undefined;
    return this.bookingsService.getBookingAnalytics(from, to);
  }
}
