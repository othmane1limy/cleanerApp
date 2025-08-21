import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, BookingStatus } from '@cleaning-marketplace/shared';
export interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}
export declare class WebSocketService {
    private prisma;
    private server;
    constructor(prisma: PrismaService);
    setServer(server: Server): void;
    authenticateSocket(socket: AuthenticatedSocket, token: string): Promise<boolean>;
    joinUserRoom(socket: AuthenticatedSocket): void;
    joinBookingRoom(socket: AuthenticatedSocket, bookingId: string): void;
    leaveBookingRoom(socket: AuthenticatedSocket, bookingId: string): void;
    notifyBookingStatusUpdate(bookingId: string, oldStatus: BookingStatus, newStatus: BookingStatus, actor: any): Promise<void>;
    notifyNewBookingRequest(bookingId: string): Promise<void>;
    broadcastCleanerLocation(cleanerUserId: string, lat: number, lng: number): Promise<void>;
    notifyWalletUpdate(cleanerUserId: string, oldBalance: number, newBalance: number, transaction: any): void;
    notifyCommissionDeducted(cleanerUserId: string, bookingId: string, commissionAmount: number): void;
    notifyAdminAlert(type: string, data: any, severity?: string): void;
    notifyNewDispute(disputeId: string, dispute: any): void;
    notifyVerificationRequired(cleanerUserId: string, document: any): void;
    sendNotificationToUser(userId: string, type: string, data: any): void;
    sendNotificationToRole(role: UserRole, type: string, data: any): void;
    broadcastSystemNotification(type: string, message: string, severity?: string): void;
    private connectedClients;
    addClient(socket: AuthenticatedSocket, userId: string, userType: string): void;
    removeClient(socketId: string): void;
    getUserIdFromSocket(socket: AuthenticatedSocket): string | null;
    updateCleanerLocation(userId: string, locationData: {
        lat: number;
        lng: number;
    }): Promise<void>;
    getNearbyCleaners(lat: number, lng: number, radius?: number, serviceId?: string): Promise<{
        distance: number;
        eta: number;
        baseLocation: {
            id: string;
            userId: string | null;
            createdAt: Date;
            label: string;
            lat: number;
            lng: number;
            addressText: string;
        };
        services: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        }[];
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getBookingLocationStatus(bookingId: string, userId: string): Promise<{
        bookingId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        cleaner: {
            id: string;
            name: string;
            location: {
                lat: any;
                lng: any;
            };
        };
        client: {
            id: string;
            name: string;
            location: {
                lat: number;
                lng: number;
            };
        };
        timestamp: Date;
    }>;
    private calculateDistance;
    private toRadians;
    getConnectedUsersCount(): number;
    getUserConnections(userId: string): number;
    getOnlineCleaners(): Promise<string[]>;
    getConnectionStats(): {
        totalConnections: number;
        clientConnections: number;
        cleanerConnections: number;
        adminConnections: number;
        timestamp: Date;
    };
    canAccessBooking(bookingId: string, userId: string, role: UserRole): Promise<boolean>;
}
