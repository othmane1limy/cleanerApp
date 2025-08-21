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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const services_service_1 = require("./services.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const shared_1 = require("@cleaning-marketplace/shared");
let ServicesController = class ServicesController {
    servicesService;
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    async getServiceCategories() {
        return this.servicesService.getServiceCategories();
    }
    async searchServices(filters) {
        return this.servicesService.searchServices(filters);
    }
    async getServiceStatistics() {
        return this.servicesService.getServiceStatistics();
    }
    async getServices() {
        return this.servicesService.getServices();
    }
    async getServiceById(serviceId) {
        return this.servicesService.getServiceById(serviceId);
    }
    async createServiceCategory(categoryData) {
        return this.servicesService.createServiceCategory(categoryData);
    }
    async createService(serviceData) {
        return this.servicesService.createService(serviceData);
    }
    async getCleanerServices(req) {
        return this.servicesService.getCleanerServices(req.user.id);
    }
    async createCleanerService(req, serviceData) {
        return this.servicesService.createCleanerService(req.user.id, serviceData);
    }
    async updateCleanerService(req, serviceId, updateData) {
        return this.servicesService.updateCleanerService(req.user.id, serviceId, updateData);
    }
    async deleteCleanerService(req, serviceId) {
        return this.servicesService.deleteCleanerService(req.user.id, serviceId);
    }
    async getServiceAddons(req, serviceId) {
        return this.servicesService.getServiceAddons(req.user.id, serviceId);
    }
    async createServiceAddon(req, serviceId, addonData) {
        return this.servicesService.createServiceAddon(req.user.id, serviceId, addonData);
    }
    async updateServiceAddon(req, addonId, updateData) {
        return this.servicesService.updateServiceAddon(req.user.id, addonId, updateData);
    }
    async deleteServiceAddon(req, addonId) {
        return this.servicesService.deleteServiceAddon(req.user.id, addonId);
    }
    async getServicePhotos(req, serviceId) {
        return this.servicesService.getServicePhotos(req.user.id, serviceId);
    }
    async addServicePhoto(req, serviceId, file) {
        if (!file) {
            throw new common_1.BadRequestException('Photo file is required');
        }
        const photoData = {
            url: `/uploads/service-photos/${file.filename}`,
        };
        return this.servicesService.addServicePhoto(req.user.id, serviceId, photoData);
    }
    async deleteServicePhoto(req, photoId) {
        return this.servicesService.deleteServicePhoto(req.user.id, photoId);
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all service categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service categories retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServiceCategories", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for services near location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Services retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'minRating', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['distance', 'price', 'rating'] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "searchServices", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServiceStatistics", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all base services' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Services retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)(':serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Service ID' }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServiceById", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create service category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
            },
            required: ['name'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createServiceCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create base service' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Service created successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                categoryId: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                baseDurationMin: { type: 'number' },
            },
            required: ['categoryId', 'name', 'baseDurationMin'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createService", null);
__decorate([
    (0, common_1.Get)('cleaner/my-services'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleaner services' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleaner services retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getCleanerServices", null);
__decorate([
    (0, common_1.Post)('cleaner/my-services'),
    (0, swagger_1.ApiOperation)({ summary: 'Add service to cleaner offerings' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Service added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Service already offered or invalid data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot add services while inactive' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                serviceId: { type: 'string' },
                priceMad: { type: 'number', minimum: 0 },
            },
            required: ['serviceId', 'priceMad'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createCleanerService", null);
__decorate([
    (0, common_1.Put)('cleaner/my-services/:serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cleaner service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                priceMad: { type: 'number', minimum: 0 },
                active: { type: 'boolean' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "updateCleanerService", null);
__decorate([
    (0, common_1.Delete)('cleaner/my-services/:serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete cleaner service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete service with active bookings' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteCleanerService", null);
__decorate([
    (0, common_1.Get)('cleaner/my-services/:serviceId/addons'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service addons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Addons retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServiceAddons", null);
__decorate([
    (0, common_1.Post)('cleaner/my-services/:serviceId/addons'),
    (0, swagger_1.ApiOperation)({ summary: 'Create service addon' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Addon created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                priceMad: { type: 'number', minimum: 0 },
                extraDurationMin: { type: 'number', minimum: 0 },
            },
            required: ['name', 'priceMad', 'extraDurationMin'],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createServiceAddon", null);
__decorate([
    (0, common_1.Put)('cleaner/addons/:addonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update service addon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Addon updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Addon not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'addonId', description: 'Addon ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                priceMad: { type: 'number', minimum: 0 },
                extraDurationMin: { type: 'number', minimum: 0 },
                active: { type: 'boolean' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('addonId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "updateServiceAddon", null);
__decorate([
    (0, common_1.Delete)('cleaner/addons/:addonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete service addon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Addon deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Addon not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'addonId', description: 'Addon ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('addonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteServiceAddon", null);
__decorate([
    (0, common_1.Get)('cleaner/my-services/:serviceId/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service photos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Photos retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServicePhotos", null);
__decorate([
    (0, common_1.Post)('cleaner/my-services/:serviceId/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Add service photo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Photo added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Maximum photos limit reached' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Cleaner Service ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "addServicePhoto", null);
__decorate([
    (0, common_1.Delete)('cleaner/photos/:photoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete service photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Photo deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Photo not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_1.Roles)(shared_1.UserRole.CLEANER),
    (0, swagger_1.ApiParam)({ name: 'photoId', description: 'Photo ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteServicePhoto", null);
exports.ServicesController = ServicesController = __decorate([
    (0, swagger_1.ApiTags)('services'),
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map