import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService;
    private prisma;
    private server;
    constructor(jwtService: JwtService, prisma: PrismaService);
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
