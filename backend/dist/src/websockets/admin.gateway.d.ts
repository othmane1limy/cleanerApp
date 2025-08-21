import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from './websocket.service';
import { UserRole } from '@prisma/client';
export declare class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly webSocketService;
    server: Server;
    private logger;
    constructor(webSocketService: WebSocketService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinAdminNotifications(client: Socket, data: {
        userId: string;
    }): Promise<void>;
    handleGetRealTimeStats(client: Socket, data: {
        period: string;
    }): Promise<void>;
    handleMonitorBooking(client: Socket, data: {
        bookingId: string;
    }): Promise<void>;
    handleStopMonitoringBooking(client: Socket, data: {
        bookingId: string;
    }): Promise<void>;
    handleSendSystemNotification(client: Socket, data: {
        message: string;
        type: 'info' | 'warning' | 'error';
        targetRole?: UserRole;
        targetUserId?: string;
    }): Promise<void>;
    notifyAdmins(event: string, data: any): Promise<void>;
    sendFraudAlert(alertData: any): Promise<void>;
    sendBookingAlert(bookingId: string, alertType: string, data: any): Promise<void>;
    broadcastMaintenanceNotification(message: string, scheduledTime?: string): Promise<void>;
}
