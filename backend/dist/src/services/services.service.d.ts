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
                        email: string;
                        phone: string | null;
                        passwordHash: string;
                        role: import("@prisma/client").$Enums.UserRole;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
    })[]>;
    createServiceCategory(categoryData: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    getServices(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
        };
        cleanerServices: ({
            cleaner: {
                user: {
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        categoryId: string;
        baseDurationMin: number;
    })[]>;
    getServiceById(serviceId: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
        };
        cleanerServices: ({
            cleaner: {
                user: {
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
            addons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                url: string;
                cleanerServiceId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        categoryId: string;
        baseDurationMin: number;
    }>;
    createService(serviceData: any): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        categoryId: string;
        baseDurationMin: number;
    }>;
    getCleanerServices(userId: string): Promise<({
        service: {
            category: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        };
        addons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            active: boolean;
            priceMad: number;
            cleanerServiceId: string;
            extraDurationMin: number;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            cleanerServiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
    })[]>;
    createCleanerService(userId: string, serviceData: any): Promise<{
        service: {
            category: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
    }>;
    updateCleanerService(userId: string, serviceId: string, updateData: any): Promise<{
        service: {
            category: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
    }>;
    deleteCleanerService(userId: string, serviceId: string): Promise<{
        success: boolean;
    }>;
    getServiceAddons(userId: string, cleanerServiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        priceMad: number;
        cleanerServiceId: string;
        extraDurationMin: number;
    }[]>;
    createServiceAddon(userId: string, cleanerServiceId: string, addonData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        priceMad: number;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    updateServiceAddon(userId: string, addonId: string, updateData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        priceMad: number;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    deleteServiceAddon(userId: string, addonId: string): Promise<{
        success: boolean;
    }>;
    getServicePhotos(userId: string, cleanerServiceId: string): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        cleanerServiceId: string;
    }[]>;
    addServicePhoto(userId: string, cleanerServiceId: string, photoData: any): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        cleanerServiceId: string;
    }>;
    deleteServicePhoto(userId: string, photoId: string): Promise<{
        success: boolean;
    }>;
    searchServices(filters: any): Promise<({
        service: {
            category: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        };
        cleaner: {
            user: {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            baseLocation: {
                id: string;
                createdAt: Date;
                userId: string | null;
                lat: number;
                lng: number;
                label: string;
                addressText: string;
            };
            liveLocation: {
                updatedAt: Date;
                cleanerUserId: string;
                lat: number;
                lng: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            businessName: string;
            bio: string | null;
            ratingAvg: number;
            ratingCount: number;
            isVerified: boolean;
            active: boolean;
            completedJobsCount: number;
            freeJobsUsed: number;
            baseLocationId: string | null;
        };
        addons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            active: boolean;
            priceMad: number;
            cleanerServiceId: string;
            extraDurationMin: number;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            cleanerServiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        cleanerUserId: string;
        serviceId: string;
        priceMad: number;
    })[]>;
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
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            categoryId: string;
            baseDurationMin: number;
        })[];
    }>;
    private calculateDistance;
    private toRadians;
}
