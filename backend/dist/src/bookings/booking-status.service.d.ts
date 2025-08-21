import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, UserRole } from '@cleaning-marketplace/shared';
export declare class BookingStatusService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly statusTransitions;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus, actorUserId: string, actorRole: UserRole, meta?: any): Promise<{
        cleanerService: {
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
        };
        cleaner: {
            cleanerProfile: {
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
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
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    private validateStatusUpdatePermission;
    private handleStatusTransition;
    private handleBookingAccepted;
    private handleBookingCompleted;
    private handleClientConfirmation;
    private handleBookingCancelled;
    autoConfirmExpiredBookings(): Promise<void>;
    getBookingStatusHistory(bookingId: string): Promise<({
        actor: {
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
            cleanerProfile: {
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
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string;
        bookingId: string;
        oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
        newStatus: import("@prisma/client").$Enums.BookingStatus;
    })[]>;
    canUpdateBookingStatus(bookingId: string, userId: string, role: UserRole): Promise<boolean>;
}
