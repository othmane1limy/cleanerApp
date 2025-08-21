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
import { AdminService } from './admin.service';
import { VerificationService } from './verification.service';
import { DisputeService } from './dispute.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guard';
import { UserRole, DisputeStatus, VerificationDocumentStatus } from '@cleaning-marketplace/shared';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly verificationService: VerificationService,
    private readonly disputeService: DisputeService,
  ) {}

  // ======================
  // Dashboard & Analytics
  // ======================

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getDashboard() {
    return this.adminService.getDashboardOverview();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get comprehensive platform analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const from = dateFrom ? new Date(dateFrom) : undefined;
    const to = dateTo ? new Date(dateTo) : undefined;
    return this.adminService.getPlatformAnalytics(from, to);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  async getPerformanceMetrics() {
    return this.adminService.getPerformanceMetrics();
  }

  // ======================
  // User Management
  // ======================

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'emailVerified', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getAllUsers(@Query() filters: any) {
    return this.adminService.getAllUsers(filters);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserDetails(@Param('userId') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  // ======================
  // Cleaner Verification
  // ======================

  @Get('verifications/pending')
  @ApiOperation({ summary: 'Get pending cleaner verifications' })
  @ApiResponse({ status: 200, description: 'Pending verifications retrieved successfully' })
  async getPendingVerifications() {
    return this.verificationService.getPendingVerifications();
  }

  @Get('verifications/statistics')
  @ApiOperation({ summary: 'Get verification statistics' })
  @ApiResponse({ status: 200, description: 'Verification statistics retrieved successfully' })
  async getVerificationStatistics() {
    return this.verificationService.getVerificationStatistics();
  }

  @Get('verifications/cleaner/:cleanerId')
  @ApiOperation({ summary: 'Get cleaner verification status' })
  @ApiResponse({ status: 200, description: 'Verification status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cleaner not found' })
  @ApiParam({ name: 'cleanerId', description: 'Cleaner User ID' })
  async getCleanerVerificationStatus(@Param('cleanerId') cleanerId: string) {
    return this.verificationService.getCleanerVerificationStatus(cleanerId);
  }

  @Put('verifications/documents/:documentId')
  @ApiOperation({ summary: 'Review verification document' })
  @ApiResponse({ status: 200, description: 'Document reviewed successfully' })
  @ApiResponse({ status: 400, description: 'Document already reviewed' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(VerificationDocumentStatus) },
        reason: { type: 'string', maxLength: 500 },
      },
      required: ['status'],
    },
  })
  async reviewDocument(
    @Request() req: any,
    @Param('documentId') documentId: string,
    @Body() body: { status: VerificationDocumentStatus; reason?: string }
  ) {
    return this.verificationService.reviewVerificationDocument(
      documentId,
      req.user.id,
      body.status,
      body.reason
    );
  }

  @Put('verifications/cleaner/:cleanerId')
  @ApiOperation({ summary: 'Update cleaner verification status' })
  @ApiResponse({ status: 200, description: 'Cleaner verification updated successfully' })
  @ApiResponse({ status: 404, description: 'Cleaner not found' })
  @ApiParam({ name: 'cleanerId', description: 'Cleaner User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' },
        reason: { type: 'string', maxLength: 500 },
      },
      required: ['verified'],
    },
  })
  async updateCleanerVerification(
    @Request() req: any,
    @Param('cleanerId') cleanerId: string,
    @Body() body: { verified: boolean; reason?: string }
  ) {
    return this.verificationService.verifyCleaner(cleanerId, req.user.id, body.verified, body.reason);
  }

  // ======================
  // Dispute Management
  // ======================

  @Get('disputes')
  @ApiOperation({ summary: 'Get all disputes' })
  @ApiResponse({ status: 200, description: 'Disputes retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, enum: DisputeStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getDisputes(@Query() filters: any) {
    return this.disputeService.getDisputes(filters);
  }

  @Get('disputes/:disputeId')
  @ApiOperation({ summary: 'Get dispute details' })
  @ApiResponse({ status: 200, description: 'Dispute details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  @ApiParam({ name: 'disputeId', description: 'Dispute ID' })
  async getDisputeDetails(@Param('disputeId') disputeId: string) {
    return this.disputeService.getDisputeById(disputeId);
  }

  @Put('disputes/:disputeId/resolve')
  @ApiOperation({ summary: 'Resolve dispute' })
  @ApiResponse({ status: 200, description: 'Dispute resolved successfully' })
  @ApiResponse({ status: 400, description: 'Dispute already resolved' })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  @ApiParam({ name: 'disputeId', description: 'Dispute ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: [DisputeStatus.RESOLVED, DisputeStatus.REJECTED] },
        resolutionNote: { type: 'string', maxLength: 1000 },
      },
      required: ['status', 'resolutionNote'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async resolveDispute(
    @Request() req: any,
    @Param('disputeId') disputeId: string,
    @Body() body: { status: DisputeStatus; resolutionNote: string }
  ) {
    return this.disputeService.resolveDispute(disputeId, req.user.id, body.status, body.resolutionNote);
  }

  @Get('disputes/statistics')
  @ApiOperation({ summary: 'Get dispute statistics' })
  @ApiResponse({ status: 200, description: 'Dispute statistics retrieved successfully' })
  async getDisputeStatistics() {
    return this.disputeService.getDisputeStatistics();
  }

  // ======================
  // Fraud Management
  // ======================

  @Get('fraud-flags')
  @ApiOperation({ summary: 'Get fraud flags' })
  @ApiResponse({ status: 200, description: 'Fraud flags retrieved successfully' })
  @ApiQuery({ name: 'severity', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getFraudFlags(@Query() filters: any) {
    return this.adminService.getFraudFlags(filters);
  }

  @Post('fraud-flags')
  @ApiOperation({ summary: 'Create fraud flag' })
  @ApiResponse({ status: 201, description: 'Fraud flag created successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        type: { type: 'string' },
        severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        reason: { type: 'string', maxLength: 1000 },
      },
      required: ['userId', 'type', 'severity', 'reason'],
    },
  })
  async createFraudFlag(
    @Request() req: any,
    @Body() body: { userId: string; type: string; severity: string; reason: string }
  ) {
    return this.adminService.createFraudFlag(
      body.userId,
      body.type,
      body.severity,
      body.reason,
      req.user.id
    );
  }

  // ======================
  // System Monitoring
  // ======================

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'entity', required: false, type: String })
  @ApiQuery({ name: 'actorUserId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getAuditLogs(@Query() filters: any) {
    return this.adminService.getAuditLogs(filters);
  }

  @Get('moderation-queue')
  @ApiOperation({ summary: 'Get content moderation queue' })
  @ApiResponse({ status: 200, description: 'Moderation queue retrieved successfully' })
  async getModerationQueue() {
    return this.adminService.getContentModerationQueue();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update platform settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commissionRate: { type: 'number', minimum: 0, maximum: 1 },
        freeJobsQuota: { type: 'number', minimum: 0, maximum: 100 },
        debtLimitMad: { type: 'number', maximum: 0 },
        maintenanceMode: { type: 'boolean' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Request() req: any, @Body() settings: any) {
    return this.adminService.updatePlatformSettings(req.user.id, settings);
  }
}
