import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingStatus } from '../../../shared/src/types';
interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        role: string;
    };
}
export declare class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    constructor();
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinBooking(client: AuthenticatedSocket, data: {
        bookingId: string;
    }): Promise<void>;
    handleLeaveBooking(client: AuthenticatedSocket, data: {
        bookingId: string;
    }): Promise<void>;
    handleBookingStatusUpdate(client: AuthenticatedSocket, data: {
        bookingId: string;
        status: BookingStatus;
        meta?: any;
    }): Promise<void>;
    handleTrackingRequest(client: AuthenticatedSocket, data: {
        bookingId: string;
    }): Promise<void>;
    handleClientOnline(client: AuthenticatedSocket): Promise<void>;
    handleCleanerAvailable(client: AuthenticatedSocket, data: {
        available: boolean;
    }): Promise<void>;
    handlePing(client: AuthenticatedSocket): void;
}
export {};
