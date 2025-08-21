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
                        email: string;
                        phone: string | null;
                        passwordHash: string;
                        role: import("@prisma/client").$Enums.UserRole;
                        emailVerified: boolean;
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
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
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
    searchServices(filters: any): Promise<({
        cleaner: {
            user: {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            baseLocation: {
                id: string;
                createdAt: Date;
                userId: string | null;
                addressText: string;
                lat: number;
                lng: number;
                label: string;
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
            baseLocationId: string | null;
            completedJobsCount: number;
            freeJobsUsed: number;
        };
        addons: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            active: boolean;
            cleanerServiceId: string;
            priceMad: number;
            extraDurationMin: number;
        }[];
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
        photos: {
            id: string;
            createdAt: Date;
            cleanerServiceId: string;
            url: string;
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
                    createdAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
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
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
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
                    createdAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
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
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
            addons: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
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
    createServiceCategory(categoryData: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
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
    getCleanerServices(req: any): Promise<({
        addons: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            active: boolean;
            cleanerServiceId: string;
            priceMad: number;
            extraDurationMin: number;
        }[];
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
        photos: {
            id: string;
            createdAt: Date;
            cleanerServiceId: string;
            url: string;
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
    createCleanerService(req: any, serviceData: any): Promise<{
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
    updateCleanerService(req: any, serviceId: string, updateData: any): Promise<{
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
    deleteCleanerService(req: any, serviceId: string): Promise<{
        success: boolean;
    }>;
    getServiceAddons(req: any, serviceId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        active: boolean;
        cleanerServiceId: string;
        priceMad: number;
        extraDurationMin: number;
    }[]>;
    createServiceAddon(req: any, serviceId: string, addonData: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        active: boolean;
        cleanerServiceId: string;
        priceMad: number;
        extraDurationMin: number;
    }>;
    updateServiceAddon(req: any, addonId: string, updateData: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        active: boolean;
        cleanerServiceId: string;
        priceMad: number;
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
