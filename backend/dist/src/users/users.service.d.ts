import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
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
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            userId: string;
            defaultLocationId: string | null;
        } | ({
            services: ({
                service: {
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
            completedJobsCount: number;
            freeJobsUsed: number;
            baseLocationId: string | null;
        });
    }>;
    updateClientProfile(userId: string, updateData: any): Promise<{
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
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        userId: string;
        defaultLocationId: string | null;
    }>;
    updateCleanerProfile(userId: string, updateData: any): Promise<{
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
        completedJobsCount: number;
        freeJobsUsed: number;
        baseLocationId: string | null;
    }>;
    updateCleanerAvailability(userId: string, active: boolean): Promise<{
        active: boolean;
    }>;
    updateCleanerLocation(userId: string, lat: number, lng: number): Promise<{
        updatedAt: Date;
        cleanerUserId: string;
        lat: number;
        lng: number;
    }>;
    uploadVerificationDocument(userId: string, documentData: any): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        type: string;
        url: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    getVerificationDocuments(userId: string): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        type: string;
        url: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }[]>;
    createLocation(userId: string, locationData: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        lat: number;
        lng: number;
        label: string;
        addressText: string;
    }>;
    getUserLocations(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        lat: number;
        lng: number;
        label: string;
        addressText: string;
    }[]>;
    deleteLocation(userId: string, locationId: string): Promise<{
        success: boolean;
    }>;
    getCleanerStats(userId: string): Promise<{
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
            completedJobsCount: number;
            freeJobsUsed: number;
            baseLocationId: string | null;
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
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
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
                description: string | null;
                categoryId: string;
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
        completedJobsCount: number;
        freeJobsUsed: number;
        baseLocationId: string | null;
    })[]>;
    private calculateDistance;
    private toRadians;
}
