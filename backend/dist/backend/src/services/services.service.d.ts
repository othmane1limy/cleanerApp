import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    getServiceCategories(): Promise<({
        services: ({
            cleanerServices: ({
                cleaner: {
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        phone: string | null;
                        passwordHash: string;
                        role: import("@prisma/client").$Enums.UserRole;
                        emailVerified: boolean;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    active: boolean;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
                updatedAt: Date;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            categoryId: string;
            baseDurationMin: number;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    })[]>;
    createServiceCategory(categoryData: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    getServices(): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
        };
        cleanerServices: ({
            cleaner: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                active: boolean;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        categoryId: string;
        baseDurationMin: number;
    })[]>;
    getServiceById(serviceId: string): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
        };
        cleanerServices: ({
            cleaner: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                active: boolean;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
            addons: {
                id: string;
                name: string;
                createdAt: Date;
                priceMad: number;
                active: boolean;
                updatedAt: Date;
                cleanerServiceId: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                cleanerServiceId: string;
                url: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        categoryId: string;
        baseDurationMin: number;
    }>;
    createService(serviceData: any): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        categoryId: string;
        baseDurationMin: number;
    }>;
    getCleanerServices(userId: string): Promise<({
        service: {
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            categoryId: string;
            baseDurationMin: number;
        };
        addons: {
            id: string;
            name: string;
            createdAt: Date;
            priceMad: number;
            active: boolean;
            updatedAt: Date;
            cleanerServiceId: string;
            extraDurationMin: number;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            cleanerServiceId: string;
            url: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
    })[]>;
    createCleanerService(userId: string, serviceData: any): Promise<{
        service: {
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            categoryId: string;
            baseDurationMin: number;
        };
    } & {
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
    }>;
    updateCleanerService(userId: string, serviceId: string, updateData: any): Promise<{
        service: {
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            categoryId: string;
            baseDurationMin: number;
        };
    } & {
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
    }>;
    deleteCleanerService(userId: string, serviceId: string): Promise<{
        success: boolean;
    }>;
    getServiceAddons(userId: string, cleanerServiceId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }[]>;
    createServiceAddon(userId: string, cleanerServiceId: string, addonData: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    updateServiceAddon(userId: string, addonId: string, updateData: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    deleteServiceAddon(userId: string, addonId: string): Promise<{
        success: boolean;
    }>;
    getServicePhotos(userId: string, cleanerServiceId: string): Promise<{
        id: string;
        createdAt: Date;
        cleanerServiceId: string;
        url: string;
    }[]>;
    addServicePhoto(userId: string, cleanerServiceId: string, photoData: any): Promise<{
        id: string;
        createdAt: Date;
        cleanerServiceId: string;
        url: string;
    }>;
    deleteServicePhoto(userId: string, photoId: string): Promise<{
        success: boolean;
    }>;
    searchServices(filters: any): Promise<any[]>;
    getServiceStatistics(): Promise<{
        totalServices: number;
        totalCategories: number;
        activeCleanerServices: number;
        popularServices: ({
            _count: {
                cleanerServices: number;
            };
            cleanerServices: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            categoryId: string;
            baseDurationMin: number;
        })[];
    }>;
    private calculateDistance;
    private toRadians;
}
