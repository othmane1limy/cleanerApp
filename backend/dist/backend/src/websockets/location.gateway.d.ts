import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    constructor();
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinLocationUpdates(client: Socket, data: {
        userId: string;
        userType: string;
    }): Promise<void>;
    handleUpdateCleanerLocation(client: Socket, data: {
        userId: string;
        latitude: number;
        longitude: number;
        address?: string;
    }): Promise<void>;
    handleGetNearbyCleaner(client: Socket, data: {
        latitude: number;
        longitude: number;
        radius: number;
        serviceId?: string;
    }): Promise<void>;
    handleTrackBookingLocation(client: Socket, data: {
        bookingId: string;
    }): Promise<void>;
    handleStopTrackingBooking(client: Socket, data: {
        bookingId: string;
    }): Promise<void>;
    broadcastLocationUpdate(bookingId: string, locationData: any): Promise<void>;
    notifyCleanerAvailability(cleanerId: string, isAvailable: boolean, location?: any): Promise<void>;
}
