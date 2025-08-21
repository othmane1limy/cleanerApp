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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const verification_service_1 = require("./verification.service");
const dispute_service_1 = require("./dispute.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const shared_1 = require("@cleaning-marketplace/shared");
let AdminController = class AdminController {
    adminService;
    verificationService;
    disputeService;
    constructor(adminService, verificationService, disputeService) {
        this.adminService = adminService;
        this.verificationService = verificationService;
        this.disputeService = disputeService;
    }
    async getDashboard() {
        return this.adminService.getDashboardOverview();
    }
    async getAnalytics(dateFrom, dateTo) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.adminService.getPlatformAnalytics(from, to);
    }
    async getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
    async getPerformanceMetrics() {
        return this.adminService.getPerformanceMetrics();
    }
    async getAllUsers(filters) {
        return this.adminService.getAllUsers(filters);
    }
    async getUserDetails(userId) {
        return this.adminService.getUserDetails(userId);
    }
    async getPendingVerifications() {
        return this.verificationService.getPendingVerifications();
    }
    async getVerificationStatistics() {
        return this.verificationService.getVerificationStatistics();
    }
    async getCleanerVerificationStatus(cleanerId) {
        return this.verificationService.getCleanerVerificationStatus(cleanerId);
    }
    async reviewDocument(req, documentId, body) {
        return this.verificationService.reviewVerificationDocument(documentId, req.user.id, body.status, body.reason);
    }
    async updateCleanerVerification(req, cleanerId, body) {
        return this.verificationService.verifyCleaner(cleanerId, req.user.id, body.verified, body.reason);
    }
    async getDisputes(filters) {
        return this.disputeService.getDisputes(filters);
    }
    async getDisputeDetails(disputeId) {
        return this.disputeService.getDisputeById(disputeId);
    }
    async resolveDispute(req, disputeId, body) {
        return this.disputeService.resolveDispute(disputeId, req.user.id, body.status, body.resolutionNote);
    }
    async getDisputeStatistics() {
        return this.disputeService.getDisputeStatistics();
    }
    async getFraudFlags(filters) {
        return this.adminService.getFraudFlags(filters);
    }
    async createFraudFlag(req, body) {
        return this.adminService.createFraudFlag(body.userId, body.type, body.severity, body.reason, req.user.id);
    }
    async getAuditLogs(filters) {
        return this.adminService.getAuditLogs(filters);
    }
    async getModerationQueue() {
        return this.adminService.getContentModerationQueue();
    }
    async updateSettings(req, settings) {
        return this.adminService.updatePlatformSettings(req.user.id, settings);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive platform analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance metrics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: shared_1.UserRole }),
    (0, swagger_1.ApiQuery)({ name: 'emailVerified', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Get)('verifications/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending cleaner verifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending verifications retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Get)('verifications/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get verification statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVerificationStatistics", null);
__decorate([
    (0, common_1.Get)('verifications/cleaner/:cleanerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaner verification status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification status retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cleaner not found' }),
    (0, swagger_1.ApiParam)({ name: 'cleanerId', description: 'Cleaner User ID' }),
    __param(0, (0, common_1.Param)('cleanerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCleanerVerificationStatus", null);
__decorate([
    (0, common_1.Put)('verifications/documents/:documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Review verification document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document reviewed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Document already reviewed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, swagger_1.ApiParam)({ name: 'documentId', description: 'Document ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: Object.values(shared_1.VerificationDocumentStatus) },
                reason: { type: 'string', maxLength: 500 },
            },
            required: ['status'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reviewDocument", null);
__decorate([
    (0, common_1.Put)('verifications/cleaner/:cleanerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cleaner verification status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleaner verification updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cleaner not found' }),
    (0, swagger_1.ApiParam)({ name: 'cleanerId', description: 'Cleaner User ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                verified: { type: 'boolean' },
                reason: { type: 'string', maxLength: 500 },
            },
            required: ['verified'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('cleanerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCleanerVerification", null);
__decorate([
    (0, common_1.Get)('disputes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all disputes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disputes retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: shared_1.DisputeStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDisputes", null);
__decorate([
    (0, common_1.Get)('disputes/:disputeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispute details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispute details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dispute not found' }),
    (0, swagger_1.ApiParam)({ name: 'disputeId', description: 'Dispute ID' }),
    __param(0, (0, common_1.Param)('disputeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDisputeDetails", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve dispute' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispute resolved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dispute already resolved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dispute not found' }),
    (0, swagger_1.ApiParam)({ name: 'disputeId', description: 'Dispute ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: [shared_1.DisputeStatus.RESOLVED, shared_1.DisputeStatus.REJECTED] },
                resolutionNote: { type: 'string', maxLength: 1000 },
            },
            required: ['status', 'resolutionNote'],
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('disputeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resolveDispute", null);
__decorate([
    (0, common_1.Get)('disputes/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispute statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispute statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDisputeStatistics", null);
__decorate([
    (0, common_1.Get)('fraud-flags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud flags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud flags retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFraudFlags", null);
__decorate([
    (0, common_1.Post)('fraud-flags'),
    (0, swagger_1.ApiOperation)({ summary: 'Create fraud flag' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fraud flag created successfully' }),
    (0, swagger_1.ApiBody)({
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
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createFraudFlag", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'entity', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'actorUserId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('moderation-queue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get content moderation queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Moderation queue retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getModerationQueue", null);
__decorate([
    (0, common_1.Put)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update platform settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated successfully' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                commissionRate: { type: 'number', minimum: 0, maximum: 1 },
                freeJobsQuota: { type: 'number', minimum: 0, maximum: 100 },
                debtLimitMad: { type: 'number', maximum: 0 },
                maintenanceMode: { type: 'boolean' },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSettings", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        verification_service_1.VerificationService,
        dispute_service_1.DisputeService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map