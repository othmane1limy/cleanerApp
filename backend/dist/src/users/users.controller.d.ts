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
            })[];
            verificationDocuments: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                type: string;
                url: string;
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
            addressText: string;
            lat: number;
            lng: number;
            label: string;
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
            addressText: string;
            lat: number;
            lng: number;
            label: string;
        };
        services: ({
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
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        type: string;
        url: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    getDocuments(req: any): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        type: string;
        url: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }[]>;
    createLocation(req: any, locationData: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        addressText: string;
        lat: number;
        lng: number;
        label: string;
    }>;
    getLocations(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        addressText: string;
        lat: number;
        lng: number;
        label: string;
    }[]>;
    deleteLocation(req: any, locationId: string): Promise<{
        success: boolean;
    }>;
    getCleanerStats(req: any): Promise<{
        profile: {
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
            freeJobsRemaining: number;
        };
        wallet: any;
        recentReviews: ({
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
            clientUserId: string;
            cleanerUserId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        })[];
    }>;
    searchCleaners(filters: any): Promise<({
        baseLocation: {
            id: string;
            createdAt: Date;
            userId: string | null;
            addressText: string;
            lat: number;
            lng: number;
            label: string;
        };
        services: ({
            service: {
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
