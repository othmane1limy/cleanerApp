import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
    createServiceCategory(categoryData: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
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
    getCleanerServices(req: any): Promise<({
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
    createCleanerService(req: any, serviceData: any): Promise<{
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
    updateCleanerService(req: any, serviceId: string, updateData: any): Promise<{
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
    deleteCleanerService(req: any, serviceId: string): Promise<{
        success: boolean;
    }>;
    getServiceAddons(req: any, serviceId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }[]>;
    createServiceAddon(req: any, serviceId: string, addonData: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    updateServiceAddon(req: any, addonId: string, updateData: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        priceMad: number;
        active: boolean;
        updatedAt: Date;
        cleanerServiceId: string;
        extraDurationMin: number;
    }>;
    deleteServiceAddon(req: any, addonId: string): Promise<{
        success: boolean;
    }>;
    getServicePhotos(req: any, serviceId: string): Promise<{
        id: string;
        createdAt: Date;
        cleanerServiceId: string;
        url: string;
    }[]>;
    addServicePhoto(req: any, serviceId: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        cleanerServiceId: string;
        url: string;
    }>;
    deleteServicePhoto(req: any, photoId: string): Promise<{
        success: boolean;
    }>;
}
