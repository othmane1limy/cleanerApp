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
  Headers,
  RawBody,
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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guard';
import { UserRole, WalletTransactionType } from '@cleaning-marketplace/shared';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ======================
  // Cleaner Wallet Operations
  // ======================

  @Get('wallet')
  @ApiOperation({ summary: 'Get cleaner wallet details' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  async getWallet(@Request() req: any) {
    return this.paymentsService.getCleanerWallet(req.user.id);
  }

  @Get('wallet/transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiQuery({ name: 'type', required: false, enum: WalletTransactionType })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getWalletTransactions(@Request() req: any, @Query() filters: any) {
    return this.paymentsService.getWalletTransactions(req.user.id, filters);
  }

  @Get('wallet/statistics')
  @ApiOperation({ summary: 'Get wallet statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  async getWalletStatistics(@Request() req: any) {
    return this.paymentsService.getWalletStatistics(req.user.id);
  }

  // ======================
  // PayPal Integration
  // ======================

  @Post('recharge/initiate')
  @ApiOperation({ summary: 'Initiate wallet recharge with PayPal' })
  @ApiResponse({ status: 201, description: 'PayPal order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid amount or cleaner not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amountMad: { type: 'number', minimum: 50, maximum: 10000 },
      },
      required: ['amountMad'],
    },
  })
  async initiateRecharge(@Request() req: any, @Body() body: { amountMad: number }) {
    return this.paymentsService.initiateWalletRecharge(req.user.id, body.amountMad);
  }

  @Post('recharge/complete')
  @ApiOperation({ summary: 'Complete wallet recharge after PayPal approval' })
  @ApiResponse({ status: 200, description: 'Recharge completed successfully' })
  @ApiResponse({ status: 400, description: 'PayPal payment not completed or invalid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paypalOrderId: { type: 'string' },
      },
      required: ['paypalOrderId'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async completeRecharge(@Request() req: any, @Body() body: { paypalOrderId: string }) {
    return this.paymentsService.completeWalletRecharge(req.user.id, body.paypalOrderId);
  }

  @Post('webhook/paypal')
  @ApiOperation({ summary: 'PayPal webhook handler' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  @HttpCode(HttpStatus.OK)
  async paypalWebhook(@Headers() headers: any, @RawBody() body: any) {
    return this.paymentsService.processWebhook(headers, body);
  }

  // ======================
  // Commission Management
  // ======================

  @Get('commissions')
  @ApiOperation({ summary: 'Get commission history' })
  @ApiResponse({ status: 200, description: 'Commissions retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getCommissionHistory(@Request() req: any, @Query() filters: any) {
    return this.paymentsService.getCommissionHistory(req.user.id, filters);
  }

  @Get('commissions/summary')
  @ApiOperation({ summary: 'Get commission summary' })
  @ApiResponse({ status: 200, description: 'Commission summary retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  async getCommissionSummary(@Request() req: any) {
    return this.paymentsService.getCommissionSummary(req.user.id);
  }

  // ======================
  // Admin Operations
  // ======================

  @Get('admin/wallets')
  @ApiOperation({ summary: 'Get all cleaner wallets' })
  @ApiResponse({ status: 200, description: 'Wallets retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiQuery({ name: 'minBalance', required: false, type: Number })
  @ApiQuery({ name: 'maxBalance', required: false, type: Number })
  async getAllWallets(@Query() filters: any) {
    return this.paymentsService.getAllWallets(filters);
  }

  @Get('admin/blocked-cleaners')
  @ApiOperation({ summary: 'Get cleaners blocked due to debt' })
  @ApiResponse({ status: 200, description: 'Blocked cleaners retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async getBlockedCleaners() {
    return this.paymentsService.getBlockedCleaners();
  }

  @Get('admin/analytics')
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getPaymentAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const from = dateFrom ? new Date(dateFrom) : undefined;
    const to = dateTo ? new Date(dateTo) : undefined;
    return this.paymentsService.getPaymentAnalytics(from, to);
  }

  @Post('admin/adjust-wallet')
  @ApiOperation({ summary: 'Adjust cleaner wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid adjustment amount' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cleanerUserId: { type: 'string' },
        amount: { type: 'number', minimum: -5000, maximum: 5000 },
        reason: { type: 'string', maxLength: 500 },
      },
      required: ['cleanerUserId', 'amount', 'reason'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async adjustWalletBalance(
    @Request() req: any,
    @Body() body: { cleanerUserId: string; amount: number; reason: string }
  ) {
    return this.paymentsService.adjustWalletBalance(
      body.cleanerUserId,
      body.amount,
      body.reason,
      req.user.id
    );
  }
}
