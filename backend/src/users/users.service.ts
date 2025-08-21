import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@cleaning-marketplace/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
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
      throw new NotFoundException('User not found');
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

  async updateClientProfile(userId: string, updateData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLIENT');

    const existingProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Client profile not found');
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

    // Update user phone if provided
    if (updateData.phone) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { phone: updateData.phone },
      });
    }

    return updatedProfile;
  }

  async updateCleanerProfile(userId: string, updateData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const existingProfile = await this.prisma.cleanerProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Cleaner profile not found');
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

  async updateCleanerAvailability(userId: string, active: boolean) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const updatedProfile = await this.prisma.cleanerProfile.update({
      where: { userId },
      data: { active },
    });

    return { active: updatedProfile.active };
  }

  async updateCleanerLocation(userId: string, lat: number, lng: number) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    // Verify cleaner exists and is active
    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner profile not found');
    }

    if (!cleaner.active) {
      throw new ForbiddenException('Cannot update location while inactive');
    }

    // Update or create live location
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

  async uploadVerificationDocument(userId: string, documentData: any) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner profile not found');
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

  async getVerificationDocuments(userId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const documents = await this.prisma.verificationDocument.findMany({
      where: { cleanerUserId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return documents;
  }

  async createLocation(userId: string, locationData: any) {
    // Set user context for RLS
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

  async getUserLocations(userId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLIENT');

    const locations = await this.prisma.location.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return locations;
  }

  async deleteLocation(userId: string, locationId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLIENT');

    // Check if location belongs to user
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, userId },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Check if location is used as default in profile
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (clientProfile?.defaultLocationId === locationId) {
      throw new BadRequestException('Cannot delete default location');
    }

    await this.prisma.location.delete({
      where: { id: locationId },
    });

    return { success: true };
  }

  async getCleanerStats(userId: string) {
    // Set user context for RLS
    await this.prisma.enableRLS(userId, 'CLEANER');

    const cleaner = await this.prisma.cleanerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
        services: {
          where: { active: true },
        },
      },
    });

    if (!cleaner) {
      throw new NotFoundException('Cleaner profile not found');
    }

    // Get booking stats
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

    // Get recent reviews
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
        booking: {
          include: {
            cleanerService: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    return {
      cleaner,
      stats: {
        totalBookings,
        completedBookings,
        thisMonthBookings,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
        avgRating: cleaner.ratingAvg,
        totalReviews: cleaner.ratingCount,
        wallet: cleaner.user.wallet,
      },
      recentReviews,
    };
  }

  async searchCleaners(filters: any) {
    const { lat, lng, radius = 10, serviceType, minRating, maxPrice } = filters;

    let whereClause: any = {
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

    // Calculate distance and filter by radius if location provided
    let results = cleaners;
    if (lat && lng) {
      results = cleaners
        .map((cleaner) => {
          const cleanerLat = cleaner.liveLocation?.lat || cleaner.baseLocation?.lat;
          const cleanerLng = cleaner.liveLocation?.lng || cleaner.baseLocation?.lng;
          
          if (!cleanerLat || !cleanerLng) return null;

          const distance = this.calculateDistance(lat, lng, cleanerLat, cleanerLng);
          
          return {
            ...cleaner,
            distance,
            eta: Math.round((distance / 30) * 60), // Assume 30 km/h average speed
          };
        })
        .filter((cleaner) => cleaner && cleaner.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }

    return results;
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
