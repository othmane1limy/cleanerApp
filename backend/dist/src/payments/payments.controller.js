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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const shared_1 = require("@cleaning-marketplace/shared");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getWallet(req) {
        return this.paymentsService.getCleanerWallet(req.user.id);
    }
    async getWalletTransactions(req, filters) {
        return this.paymentsService.getWalletTransactions(req.user.id, filters);
    }
    async getWalletStatistics(req) {
        return this.paymentsService.getWalletStatistics(req.user.id);
    }
    async initiateRecharge(req, body) {
        return this.paymentsService.initiateWalletRecharge(req.user.id, body.amountMad);
    }
    async completeRecharge(req, body) {
        return this.paymentsService.completeWalletRecharge(req.user.id, body.paypalOrderId);
    }
    async paypalWebhook(headers, body) {
        return this.paymentsService.processWebhook(headers, body);
    }
    async getCommissionHistory(req, filters) {
        return this.paymentsService.getCommissionHistory(req.user.id, filters);
    }
    async getCommissionSummary(req) {
        return this.paymentsService.getCommissionSummary(req.user.id);
    }
    async getAllWallets(filters) {
        return this.paymentsService.getAllWallets(filters);
    }
    async getBlockedCleaners() {
        return this.paymentsService.getBlockedCleaners();
    }
    async getPaymentAnalytics(dateFrom, dateTo) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.paymentsService.getPaymentAnalytics(from, to);
    }
    async adjustWalletBalance(req, body) {
        return this.paymentsService.adjustWalletBalance(body.cleanerUserId, body.amount, body.reason, req.user.id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('wallet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaner wallet details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)('wallet/transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet transaction history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: shared_1.WalletTransactionType }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getWalletTransactions", null);
__decorate([
    (0, common_1.Get)('wallet/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getWalletStatistics", null);
__decorate([
    (0, common_1.Post)('recharge/initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate wallet recharge with PayPal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'PayPal order created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid amount or cleaner not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                amountMad: { type: 'number', minimum: 50, maximum: 10000 },
            },
            required: ['amountMad'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateRecharge", null);
__decorate([
    (0, common_1.Post)('recharge/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete wallet recharge after PayPal approval' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recharge completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'PayPal payment not completed or invalid' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                paypalOrderId: { type: 'string' },
            },
            required: ['paypalOrderId'],
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "completeRecharge", null);
__decorate([
    (0, common_1.Post)('webhook/paypal'),
    (0, swagger_1.ApiOperation)({ summary: 'PayPal webhook handler' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook signature' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.RawBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paypalWebhook", null);
__decorate([
    (0, common_1.Get)('commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get commission history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commissions retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getCommissionHistory", null);
__decorate([
    (0, common_1.Get)('commissions/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get commission summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commission summary retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getCommissionSummary", null);
__decorate([
    (0, common_1.Get)('admin/wallets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cleaner wallets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallets retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiQuery)({ name: 'minBalance', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxBalance', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAllWallets", null);
__decorate([
    (0, common_1.Get)('admin/blocked-cleaners'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaners blocked due to debt' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blocked cleaners retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getBlockedCleaners", null);
__decorate([
    (0, common_1.Get)('admin/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentAnalytics", null);
__decorate([
    (0, common_1.Post)('admin/adjust-wallet'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust cleaner wallet balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet adjusted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid adjustment amount' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                cleanerUserId: { type: 'string' },
                amount: { type: 'number', minimum: -5000, maximum: 5000 },
                reason: { type: 'string', maxLength: 500 },
            },
            required: ['cleanerUserId', 'amount', 'reason'],
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "adjustWalletBalance", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map