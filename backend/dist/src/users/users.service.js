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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                clientProfile: true,
                cleanerProfile: {
                    include: {
                        services: {
                            include: {
                                service: true,
                                addons: true,
                                photos: true,
                            },
                        },
                        verificationDocuments: true,
                        liveLocation: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const profile = user.role === 'CLIENT' ? user.clientProfile : user.cleanerProfile;
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                phone: user.phone,
                createdAt: user.createdAt,
            },
            profile,
        };
    }
    async updateClientProfile(userId, updateData) {
        await this.prisma.enableRLS(userId, 'CLIENT');
        const existingProfile = await this.prisma.clientProfile.findUnique({
            where: { userId },
        });
        if (!existingProfile) {
            throw new common_1.NotFoundException('Client profile not found');
        }
        const updatedProfile = await this.prisma.clientProfile.update({
            where: { userId },
            data: {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                avatarUrl: updateData.avatarUrl,
                defaultLocationId: updateData.defaultLocationId,
            },
            include: {
                defaultLocation: true,
            },
        });
        if (updateData.phone) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { phone: updateData.phone },
            });
        }
        return updatedProfile;
    }
    async updateCleanerProfile(userId, updateData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const existingProfile = await this.prisma.cleanerProfile.findUnique({
            where: { userId },
        });
        if (!existingProfile) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        const updatedProfile = await this.prisma.cleanerProfile.update({
            where: { userId },
            data: {
                businessName: updateData.businessName,
                bio: updateData.bio,
                baseLocationId: updateData.baseLocationId,
                active: updateData.active,
            },
            include: {
                baseLocation: true,
                services: {
                    include: {
                        service: true,
                        addons: true,
                    },
                },
            },
        });
        return updatedProfile;
    }
    async updateCleanerAvailability(userId, active) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const updatedProfile = await this.prisma.cleanerProfile.update({
            where: { userId },
            data: { active },
        });
        return { active: updatedProfile.active };
    }
    async updateCleanerLocation(userId, lat, lng) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        if (!cleaner.active) {
            throw new common_1.ForbiddenException('Cannot update location while inactive');
        }
        const liveLocation = await this.prisma.cleanerLiveLocation.upsert({
            where: { cleanerUserId: userId },
            update: { lat, lng },
            create: {
                cleanerUserId: userId,
                lat,
                lng,
            },
        });
        return liveLocation;
    }
    async uploadVerificationDocument(userId, documentData) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        const document = await this.prisma.verificationDocument.create({
            data: {
                cleanerUserId: userId,
                type: documentData.type,
                url: documentData.url,
                status: 'PENDING',
            },
        });
        return document;
    }
    async getVerificationDocuments(userId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const documents = await this.prisma.verificationDocument.findMany({
            where: { cleanerUserId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return documents;
    }
    async createLocation(userId, locationData) {
        await this.prisma.enableRLS(userId, 'CLIENT');
        const location = await this.prisma.location.create({
            data: {
                userId,
                label: locationData.label,
                lat: locationData.lat,
                lng: locationData.lng,
                addressText: locationData.addressText,
            },
        });
        return location;
    }
    async getUserLocations(userId) {
        await this.prisma.enableRLS(userId, 'CLIENT');
        const locations = await this.prisma.location.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return locations;
    }
    async deleteLocation(userId, locationId) {
        await this.prisma.enableRLS(userId, 'CLIENT');
        const location = await this.prisma.location.findFirst({
            where: { id: locationId, userId },
        });
        if (!location) {
            throw new common_1.NotFoundException('Location not found');
        }
        const clientProfile = await this.prisma.clientProfile.findUnique({
            where: { userId },
        });
        if (clientProfile?.defaultLocationId === locationId) {
            throw new common_1.BadRequestException('Cannot delete default location');
        }
        await this.prisma.location.delete({
            where: { id: locationId },
        });
        return { success: true };
    }
    async getCleanerStats(userId) {
        await this.prisma.enableRLS(userId, 'CLEANER');
        const cleaner = await this.prisma.cleanerProfile.findUnique({
            where: { userId },
            include: {
                wallet: true,
                services: {
                    where: { active: true },
                },
            },
        });
        if (!cleaner) {
            throw new common_1.NotFoundException('Cleaner profile not found');
        }
        const totalBookings = await this.prisma.booking.count({
            where: { cleanerUserId: userId },
        });
        const completedBookings = await this.prisma.booking.count({
            where: {
                cleanerUserId: userId,
                status: 'CLIENT_CONFIRMED',
            },
        });
        const thisMonthBookings = await this.prisma.booking.count({
            where: {
                cleanerUserId: userId,
                status: 'CLIENT_CONFIRMED',
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        const recentReviews = await this.prisma.review.findMany({
            where: { cleanerUserId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                client: {
                    include: {
                        clientProfile: true,
                    },
                },
            },
        });
        return {
            profile: cleaner,
            stats: {
                totalBookings,
                completedBookings,
                thisMonthBookings,
                completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
                freeJobsRemaining: Math.max(0, 20 - cleaner.freeJobsUsed),
            },
            wallet: cleaner.wallet,
            recentReviews,
        };
    }
    async searchCleaners(filters) {
        const { lat, lng, radius = 10, serviceType, minRating, maxPrice } = filters;
        let whereClause = {
            active: true,
            isVerified: true,
        };
        if (minRating) {
            whereClause.ratingAvg = { gte: minRating };
        }
        if (serviceType) {
            whereClause.services = {
                some: {
                    active: true,
                    service: {
                        name: { contains: serviceType, mode: 'insensitive' },
                    },
                    ...(maxPrice && { priceMad: { lte: maxPrice } }),
                },
            };
        }
        const cleaners = await this.prisma.cleanerProfile.findMany({
            where: whereClause,
            include: {
                baseLocation: true,
                services: {
                    where: { active: true },
                    include: {
                        service: true,
                        photos: true,
                    },
                },
                liveLocation: true,
            },
            take: 50,
        });
        let results = cleaners;
        if (lat && lng) {
            results = cleaners
                .map((cleaner) => {
                const cleanerLat = cleaner.liveLocation?.lat || cleaner.baseLocation?.lat;
                const cleanerLng = cleaner.liveLocation?.lng || cleaner.baseLocation?.lng;
                if (!cleanerLat || !cleanerLng)
                    return null;
                const distance = this.calculateDistance(lat, lng, cleanerLat, cleanerLng);
                return {
                    ...cleaner,
                    distance,
                    eta: Math.round((distance / 30) * 60),
                };
            })
                .filter((cleaner) => cleaner && cleaner.distance <= radius)
                .sort((a, b) => a.distance - b.distance);
        }
        return results;
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map