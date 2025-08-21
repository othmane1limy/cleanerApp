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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getServiceCategories() {
        const categories = await this.prisma.serviceCategory.findMany({
            include: {
                services: {
                    include: {
                        cleanerServices: {
                            where: { active: true },
                            include: {
                                cleaner: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    }
    async createServiceCategory(categoryData) {
        const category = await this.prisma.serviceCategory.create({
            data: {
                name: categoryData.name,
                description: categoryData.description,
            },
        });
        return category;
    }
    async getServices() {
        const services = await this.prisma.service.findMany({
            include: {
                category: true,
                cleanerServices: {
                    where: { active: true },
                    include: {
                        cleaner: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        return services;
    }
    async getServiceById(serviceId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                category: true,
                cleanerServices: {
                    where: { active: true },
                    include: {
                        cleaner: {
                            include: {
                                user: true,
                            },
                        },
                        addons: {
                            where: { active: true },
                        },
                        photos: true,
                    },
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async createService(serviceData) {
        const service = await this.prisma.service.create({
            data: {
                categoryId: serviceData.categoryId,
                name: serviceData.name,
                description: serviceData.description,
                baseDurationMin: serviceData.baseDurationMin,
            },
            include: {
                category: true,
            },
        });
        return service;
    }
    async getCleanerServices(userId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerServices = await this.prisma.cleanerService.findMany({
            where: { cleanerUserId: userId },
            include: {
                service: {
                    include: {
                        category: true,
                    },
                },
                addons: {
                    orderBy: { createdAt: 'desc' },
                },
                photos: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return cleanerServices;
    }
    async createCleanerService(userId, serviceData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        if (!cleaner.active) {
            throw new common_1.ForbiddenException('Cannot create services while inactive');
        }
        const existingService = await this.prisma.cleanerService.findFirst({
            where: {
                cleanerUserId: userId,
                serviceId: serviceData.serviceId,
            },
        });
        if (existingService) {
            throw new common_1.BadRequestException('You already offer this service');
        }
        const cleanerService = await this.prisma.cleanerService.create({
            data: {
                cleanerUserId: userId,
                serviceId: serviceData.serviceId,
                priceMad: serviceData.priceMad,
                active: true,
            },
            include: {
                service: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return cleanerService;
    }
    async updateCleanerService(userId, serviceId, updateData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: serviceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const updatedService = await this.prisma.cleanerService.update({
            where: { id: serviceId },
            data: {
                priceMad: updateData.priceMad,
                active: updateData.active,
            },
            include: {
                service: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return updatedService;
    }
    async deleteCleanerService(userId, serviceId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: serviceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const activeBookings = await this.prisma.booking.findFirst({
            where: {
                cleanerServiceId: serviceId,
                status: {
                    in: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'],
                },
            },
        });
        if (activeBookings) {
            throw new common_1.BadRequestException('Cannot delete service with active bookings');
        }
        await this.prisma.cleanerService.delete({
            where: { id: serviceId },
        });
        return { success: true };
    }
    async getServiceAddons(userId, cleanerServiceId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: cleanerServiceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const addons = await this.prisma.serviceAddon.findMany({
            where: { cleanerServiceId },
            orderBy: { createdAt: 'desc' },
        });
        return addons;
    }
    async createServiceAddon(userId, cleanerServiceId, addonData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: cleanerServiceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const addon = await this.prisma.serviceAddon.create({
            data: {
                cleanerServiceId,
                name: addonData.name,
                priceMad: addonData.priceMad,
                extraDurationMin: addonData.extraDurationMin,
                active: true,
            },
        });
        return addon;
    }
    async updateServiceAddon(userId, addonId, updateData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const addon = await this.prisma.serviceAddon.findFirst({
            where: { id: addonId },
            include: {
                cleanerService: true,
            },
        });
        if (!addon || addon.cleanerService.cleanerUserId !== userId) {
            throw new common_1.NotFoundException('Service addon not found');
        }
        const updatedAddon = await this.prisma.serviceAddon.update({
            where: { id: addonId },
            data: {
                name: updateData.name,
                priceMad: updateData.priceMad,
                extraDurationMin: updateData.extraDurationMin,
                active: updateData.active,
            },
        });
        return updatedAddon;
    }
    async deleteServiceAddon(userId, addonId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const addon = await this.prisma.serviceAddon.findFirst({
            where: { id: addonId },
            include: {
                cleanerService: true,
            },
        });
        if (!addon || addon.cleanerService.cleanerUserId !== userId) {
            throw new common_1.NotFoundException('Service addon not found');
        }
        await this.prisma.serviceAddon.delete({
            where: { id: addonId },
        });
        return { success: true };
    }
    async getServicePhotos(userId, cleanerServiceId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: cleanerServiceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const photos = await this.prisma.servicePhoto.findMany({
            where: { cleanerServiceId },
            orderBy: { createdAt: 'desc' },
        });
        return photos;
    }
    async addServicePhoto(userId, cleanerServiceId, photoData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleanerService = await this.prisma.cleanerService.findFirst({
            where: {
                id: cleanerServiceId,
                cleanerUserId: userId,
            },
        });
        if (!cleanerService) {
            throw new common_1.NotFoundException('Cleaner service not found');
        }
        const photoCount = await this.prisma.servicePhoto.count({
            where: { cleanerServiceId },
        });
        if (photoCount >= 10) {
            throw new common_1.BadRequestException('Maximum 10 photos allowed per service');
        }
        const photo = await this.prisma.servicePhoto.create({
            data: {
                cleanerServiceId,
                url: photoData.url,
            },
        });
        return photo;
    }
    async deleteServicePhoto(userId, photoId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const photo = await this.prisma.servicePhoto.findFirst({
            where: { id: photoId },
            include: {
                cleanerService: true,
            },
        });
        if (!photo || photo.cleanerService.cleanerUserId !== userId) {
            throw new common_1.NotFoundException('Service photo not found');
        }
        await this.prisma.servicePhoto.delete({
            where: { id: photoId },
        });
        return { success: true };
    }
    async searchServices(filters) {
        const { categoryId, serviceId, lat, lng, radius = 10, minPrice, maxPrice, minRating, sortBy = 'distance', } = filters;
        let whereClause = {
            active: true,
            cleaner: {
                active: true,
                isVerified: true,
            },
        };
        if (categoryId) {
            whereClause.service = { categoryId };
        }
        if (serviceId) {
            whereClause.serviceId = serviceId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            whereClause.priceMad = {};
            if (minPrice !== undefined)
                whereClause.priceMad.gte = minPrice;
            if (maxPrice !== undefined)
                whereClause.priceMad.lte = maxPrice;
        }
        if (minRating) {
            whereClause.cleaner.ratingAvg = { gte: minRating };
        }
        const cleanerServices = await this.prisma.cleanerService.findMany({
            where: whereClause,
            include: {
                service: {
                    include: {
                        category: true,
                    },
                },
                cleaner: {
                    include: {
                        user: true,
                        baseLocation: true,
                        liveLocation: true,
                    },
                },
                addons: {
                    where: { active: true },
                },
                photos: true,
            },
            take: 100,
        });
        let results = cleanerServices;
        if (lat && lng) {
            results = cleanerServices
                .map((cleanerService) => {
                const cleanerLat = cleanerService.cleaner.liveLocation?.lat || cleanerService.cleaner.baseLocation?.lat;
                const cleanerLng = cleanerService.cleaner.liveLocation?.lng || cleanerService.cleaner.baseLocation?.lng;
                if (!cleanerLat || !cleanerLng)
                    return null;
                const distance = this.calculateDistance(lat, lng, cleanerLat, cleanerLng);
                return {
                    ...cleanerService,
                    distance,
                    eta: Math.round((distance / 30) * 60),
                };
            })
                .filter((service) => service && service.distance <= radius);
            if (sortBy === 'distance') {
                results.sort((a, b) => a.distance - b.distance);
            }
            else if (sortBy === 'price') {
                results.sort((a, b) => a.priceMad - b.priceMad);
            }
            else if (sortBy === 'rating') {
                results.sort((a, b) => b.cleaner.ratingAvg - a.cleaner.ratingAvg);
            }
        }
        return results;
    }
    async getServiceStatistics() {
        const totalServices = await this.prisma.service.count();
        const totalCategories = await this.prisma.serviceCategory.count();
        const activeCleanerServices = await this.prisma.cleanerService.count({
            where: { active: true },
        });
        const popularServices = await this.prisma.service.findMany({
            include: {
                cleanerServices: {
                    where: { active: true },
                },
                _count: {
                    select: { cleanerServices: true },
                },
            },
            orderBy: {
                cleanerServices: {
                    _count: 'desc',
                },
            },
            take: 10,
        });
        return {
            totalServices,
            totalCategories,
            activeCleanerServices,
            popularServices,
        };
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
                Math.cos(this.toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map