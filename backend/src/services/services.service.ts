import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@cleaning-marketplace/shared';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // Service Categories Management
  // ======================

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

  async createServiceCategory(categoryData: any) {
    const category = await this.prisma.serviceCategory.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });

    return category;
  }

  // ======================
  // Base Services Management
  // ======================

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

  async getServiceById(serviceId: string) {
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
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(serviceData: any) {
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

  // ======================
  // Cleaner Services Management
  // ======================

  async getCleanerServices(userId: string) {
    // Set user context for RLS
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

  async createCleanerService(userId: string, serviceData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify cleaner profile exists and is active
    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner profile not found');
    }

    if (!cleaner.active) {
      throw new ForbiddenException('Cannot create services while inactive');
    }

    // Check if cleaner already offers this service
    const existingService = await this.prisma.cleanerService.findFirst({
      where: {
        cleanerUserId: userId,
        serviceId: serviceData.serviceId,
      },
    });

    if (existingService) {
      throw new BadRequestException('You already offer this service');
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

  async updateCleanerService(userId: string, serviceId: string, updateData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: serviceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
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

  async deleteCleanerService(userId: string, serviceId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: serviceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
    }

    // Check if service has active bookings
    const activeBookings = await this.prisma.booking.findFirst({
      where: {
        cleanerServiceId: serviceId,
        status: {
          in: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'],
        },
      },
    });

    if (activeBookings) {
      throw new BadRequestException('Cannot delete service with active bookings');
    }

    await this.prisma.cleanerService.delete({
      where: { id: serviceId },
    });

    return { success: true };
  }

  // ======================
  // Service Addons Management
  // ======================

  async getServiceAddons(userId: string, cleanerServiceId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership
    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: cleanerServiceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
    }

    const addons = await this.prisma.serviceAddon.findMany({
      where: { cleanerServiceId },
      orderBy: { createdAt: 'desc' },
    });

    return addons;
  }

  async createServiceAddon(userId: string, cleanerServiceId: string, addonData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership
    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: cleanerServiceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
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

  async updateServiceAddon(userId: string, addonId: string, updateData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership through cleaner service
    const addon = await this.prisma.serviceAddon.findFirst({
      where: { id: addonId },
      include: {
        cleanerService: true,
      },
    });

    if (!addon || addon.cleanerService.cleanerUserId !== userId) {
      throw new NotFoundException('Service addon not found');
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

  async deleteServiceAddon(userId: string, addonId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership through cleaner service
    const addon = await this.prisma.serviceAddon.findFirst({
      where: { id: addonId },
      include: {
        cleanerService: true,
      },
    });

    if (!addon || addon.cleanerService.cleanerUserId !== userId) {
      throw new NotFoundException('Service addon not found');
    }

    await this.prisma.serviceAddon.delete({
      where: { id: addonId },
    });

    return { success: true };
  }

  // ======================
  // Service Photos Management
  // ======================

  async getServicePhotos(userId: string, cleanerServiceId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership
    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: cleanerServiceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
    }

    const photos = await this.prisma.servicePhoto.findMany({
      where: { cleanerServiceId },
      orderBy: { createdAt: 'desc' },
    });

    return photos;
  }

  async addServicePhoto(userId: string, cleanerServiceId: string, photoData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership
    const cleanerService = await this.prisma.cleanerService.findFirst({
      where: {
        id: cleanerServiceId,
        cleanerUserId: userId,
      },
    });

    if (!cleanerService) {
      throw new NotFoundException('Cleaner service not found');
    }

    // Check photo limit (max 10 photos per service)
    const photoCount = await this.prisma.servicePhoto.count({
      where: { cleanerServiceId },
    });

    if (photoCount >= 10) {
      throw new BadRequestException('Maximum 10 photos allowed per service');
    }

    const photo = await this.prisma.servicePhoto.create({
      data: {
        cleanerServiceId,
        url: photoData.url,
      },
    });

    return photo;
  }

  async deleteServicePhoto(userId: string, photoId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify ownership through cleaner service
    const photo = await this.prisma.servicePhoto.findFirst({
      where: { id: photoId },
      include: {
        cleanerService: true,
      },
    });

    if (!photo || photo.cleanerService.cleanerUserId !== userId) {
      throw new NotFoundException('Service photo not found');
    }

    await this.prisma.servicePhoto.delete({
      where: { id: photoId },
    });

    return { success: true };
  }

  // ======================
  // Public Service Discovery
  // ======================

  async searchServices(filters: any) {
    const {
      categoryId,
      serviceId,
      lat,
      lng,
      radius = 10,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'distance', // distance, price, rating
    } = filters;

    let whereClause: any = {
      active: true,
      cleaner: {
        active: true,
        isVerified: true,
      },
    };

    // Filter by category or service
    if (categoryId) {
      whereClause.service = { categoryId };
    }
    if (serviceId) {
      whereClause.serviceId = serviceId;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.priceMad = {};
      if (minPrice !== undefined) whereClause.priceMad.gte = minPrice;
      if (maxPrice !== undefined) whereClause.priceMad.lte = maxPrice;
    }

    // Filter by rating
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
      take: 100, // Limit results
    });

    // Calculate distance and filter by radius if location provided
    let results: any[] = cleanerServices;
    if (lat && lng) {
      const resultsWithDistance = cleanerServices
        .map((cleanerService) => {
          const cleanerLat = cleanerService.cleaner.liveLocation?.lat || cleanerService.cleaner.baseLocation?.lat;
          const cleanerLng = cleanerService.cleaner.liveLocation?.lng || cleanerService.cleaner.baseLocation?.lng;

          if (!cleanerLat || !cleanerLng) return null;

          const distance = this.calculateDistance(lat, lng, cleanerLat, cleanerLng);

          return {
            ...cleanerService,
            distance,
            eta: Math.round((distance / 30) * 60), // Assume 30 km/h average speed
          };
        })
        .filter((service) => service && service.distance <= radius) as any[];

      results = resultsWithDistance;

      // Sort results
      if (sortBy === 'distance') {
        results.sort((a, b) => (a as any).distance - (b as any).distance);
      } else if (sortBy === 'price') {
        results.sort((a, b) => a.priceMad - b.priceMad);
      } else if (sortBy === 'rating') {
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

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
