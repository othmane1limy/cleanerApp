import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            phone: string;
            createdAt: Date;
        };
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            defaultLocationId: string | null;
        } | ({
            services: ({
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
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
            })[];
            verificationDocuments: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                type: string;
                url: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                reviewedBy: string | null;
                reviewedAt: Date | null;
            }[];
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
        });
    }>;
    updateClientProfile(req: any, updateData: any): Promise<{
        defaultLocation: {
            id: string;
            createdAt: Date;
            userId: string | null;
            lat: number;
            lng: number;
            label: string;
            addressText: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        defaultLocationId: string | null;
    }>;
    updateCleanerProfile(req: any, updateData: any): Promise<{
        baseLocation: {
            id: string;
            createdAt: Date;
            userId: string | null;
            lat: number;
            lng: number;
            label: string;
            addressText: string;
        };
        services: ({
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
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
    }>;
    updateAvailability(req: any, body: {
        active: boolean;
    }): Promise<{
        active: boolean;
    }>;
    updateLocation(req: any, body: {
        lat: number;
        lng: number;
    }): Promise<{
        updatedAt: Date;
        cleanerUserId: string;
        lat: number;
        lng: number;
    }>;
    uploadDocument(req: any, file: Express.Multer.File, body: {
        type: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        type: string;
        url: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    getDocuments(req: any): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        type: string;
        url: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }[]>;
    createLocation(req: any, locationData: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        lat: number;
        lng: number;
        label: string;
        addressText: string;
    }>;
    getLocations(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        lat: number;
        lng: number;
        label: string;
        addressText: string;
    }[]>;
    deleteLocation(req: any, locationId: string): Promise<{
        success: boolean;
    }>;
    getCleanerStats(req: any): Promise<{
        cleaner: {
            user: {
                wallet: {
                    updatedAt: Date;
                    ownerUserId: string;
                    balanceMad: number;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            services: {
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
        stats: {
            totalBookings: number;
            completedBookings: number;
            thisMonthBookings: number;
            completionRate: number;
            avgRating: number;
            totalReviews: number;
            wallet: {
                updatedAt: Date;
                ownerUserId: string;
                balanceMad: number;
            };
        };
        recentReviews: ({
            booking: {
                cleanerService: {
                    service: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        categoryId: string;
                        description: string | null;
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
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string | null;
                status: import("@prisma/client").$Enums.BookingStatus;
                lat: number;
                lng: number;
                cleanerServiceId: string;
                addressText: string;
                clientUserId: string;
                scheduledAt: Date;
                basePriceMad: number;
                addonsTotal: number;
                totalPriceMad: number;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
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
            cleanerUserId: string;
            bookingId: string;
            clientUserId: string;
            rating: number;
            comment: string | null;
        })[];
    }>;
    searchCleaners(filters: any): Promise<({
        baseLocation: {
            id: string;
            createdAt: Date;
            userId: string | null;
            lat: number;
            lng: number;
            label: string;
            addressText: string;
        };
        services: ({
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
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
    })[]>;
}
