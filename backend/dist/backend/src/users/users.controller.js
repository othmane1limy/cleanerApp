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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const shared_1 = require("@cleaning-marketplace/shared");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        return this.usersService.getProfile(req.user.id);
    }
    async updateClientProfile(req, updateData) {
        return this.usersService.updateClientProfile(req.user.id, updateData);
    }
    async updateCleanerProfile(req, updateData) {
        return this.usersService.updateCleanerProfile(req.user.id, updateData);
    }
    async updateAvailability(req, body) {
        return this.usersService.updateCleanerAvailability(req.user.id, body.active);
    }
    async updateLocation(req, body) {
        return this.usersService.updateCleanerLocation(req.user.id, body.lat, body.lng);
    }
    async uploadDocument(req, file, body) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const documentData = {
            type: body.type,
            url: `/uploads/documents/${file.filename}`,
        };
        return this.usersService.uploadVerificationDocument(req.user.id, documentData);
    }
    async getDocuments(req) {
        return this.usersService.getVerificationDocuments(req.user.id);
    }
    async createLocation(req, locationData) {
        return this.usersService.createLocation(req.user.id, locationData);
    }
    async getLocations(req) {
        return this.usersService.getUserLocations(req.user.id);
    }
    async deleteLocation(req, locationId) {
        return this.usersService.deleteLocation(req.user.id, locationId);
    }
    async getCleanerStats(req) {
        return this.usersService.getCleanerStats(req.user.id);
    }
    async searchCleaners(filters) {
        return this.usersService.searchCleaners(filters);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile/client'),
    (0, swagger_1.ApiOperation)({ summary: 'Update client profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                phone: { type: 'string' },
                avatarUrl: { type: 'string' },
                defaultLocationId: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateClientProfile", null);
__decorate([
    (0, common_1.Put)('profile/cleaner'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cleaner profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleaner profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                businessName: { type: 'string' },
                bio: { type: 'string' },
                baseLocationId: { type: 'string' },
                active: { type: 'boolean' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCleanerProfile", null);
__decorate([
    (0, common_1.Put)('cleaner/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cleaner availability status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability updated successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                active: { type: 'boolean' },
            },
            required: ['active'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Put)('cleaner/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cleaner live location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot update location while inactive' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                lat: { type: 'number', minimum: -90, maximum: 90 },
                lng: { type: 'number', minimum: -180, maximum: 180 },
            },
            required: ['lat', 'lng'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)('cleaner/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload verification document' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document uploaded successfully' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                type: {
                    type: 'string',
                    enum: ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'],
                },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('cleaner/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get verification documents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documents retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Location created successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                label: { type: 'string' },
                lat: { type: 'number', minimum: -90, maximum: 90 },
                lng: { type: 'number', minimum: -180, maximum: 180 },
                addressText: { type: 'string' },
            },
            required: ['label', 'lat', 'lng', 'addressText'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Get)('locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user locations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Locations retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Delete)('locations/:locationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete default location' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLIENT),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteLocation", null);
__decorate([
    (0, common_1.Get)('cleaner/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaner statistics and dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stats retrieved successfully' }),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCleanerStats", null);
__decorate([
    (0, common_1.Get)('cleaners/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for cleaners near location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleaners retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'serviceType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minRating', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchCleaners", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map