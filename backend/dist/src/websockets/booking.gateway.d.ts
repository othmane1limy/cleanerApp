import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebSocketService, AuthenticatedSocket } from './websocket.service';
import { BookingStatus } from '@cleaning-marketplace/shared';
export declare class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private webSocketService;
    server: Server;
    constructor(webSocketService: WebSocketService);
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
