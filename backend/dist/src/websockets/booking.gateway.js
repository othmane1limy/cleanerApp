"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websocket_service_1 = require("./websocket.service");
const shared_1 = require("@cleaning-marketplace/shared");
let BookingGateway = class BookingGateway {
    webSocketService;
    server;
    constructor(webSocketService) {
        this.webSocketService = webSocketService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                console.log('WebSocket connection rejected: No token provided');
                client.disconnect();
                return;
            }
            const isAuthenticated = await this.webSocketService.authenticateSocket(client, token);
            if (!isAuthenticated) {
                console.log('WebSocket connection rejected: Authentication failed');
                client.disconnect();
                return;
            }
            this.webSocketService.setServer(this.server);
            this.webSocketService.joinUserRoom(client);
            console.log(`Client connected to bookings namespace: ${client.user?.id} (${client.user?.role})`);
            client.emit('connected', {
                message: 'Connected to booking updates',
                userId: client.user?.id,
                role: client.user?.role,
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected from bookings namespace: ${client.user?.id}`);
    }
    async handleJoinBooking(client, data) {
        try {
            const { bookingId } = data;
            if (!client.user) {
                client.emit('error', { message: 'Not authenticated' });
                return;
            }
            const hasAccess = await this.webSocketService.canAccessBooking(bookingId, client.user.id, client.user.role);
            if (!hasAccess) {
                client.emit('error', { message: 'Access denied to booking' });
                return;
            }
            this.webSocketService.joinBookingRoom(client, bookingId);
            client.emit('joined_booking', {
                bookingId,
                message: 'Successfully joined booking updates',
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error('Join booking error:', error);
            client.emit('error', { message: 'Failed to join booking' });
        }
    }
    async handleLeaveBooking(client, data) {
        const { bookingId } = data;
        this.webSocketService.leaveBookingRoom(client, bookingId);
        client.emit('left_booking', {
            bookingId,
            message: 'Left booking updates',
            timestamp: new Date(),
        });
    }
    async handleBookingStatusUpdate(client, data) {
        try {
            if (!client.user) {
                client.emit('error', { message: 'Not authenticated' });
                return;
            }
            const { bookingId, status, meta } = data;
            await this.webSocketService.notifyBookingStatusUpdate(bookingId, shared_1.BookingStatus.REQUESTED, status, {
                userId: client.user.id,
                role: client.user.role,
            });
            client.emit('status_update_sent', {
                bookingId,
                status,
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error('Status update error:', error);
            client.emit('error', { message: 'Failed to update status' });
        }
    }
    async handleTrackingRequest(client, data) {
        try {
            if (!client.user) {
                client.emit('error', { message: 'Not authenticated' });
                return;
            }
            const { bookingId } = data;
            client.emit('tracking_update', {
                bookingId,
                message: 'Tracking data would be sent here',
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error('Tracking request error:', error);
            client.emit('error', { message: 'Failed to get tracking data' });
        }
    }
    async handleClientOnline(client) {
        if (client.user?.role === 'CLIENT') {
            console.log(`Client ${client.user.id} is online`);
        }
    }
    async handleCleanerAvailable(client, data) {
        if (client.user?.role === 'CLEANER') {
            this.webSocketService.sendNotificationToRole('ADMIN', 'CLEANER_AVAILABILITY_CHANGED', {
                cleanerUserId: client.user.id,
                available: data.available,
                timestamp: new Date(),
            });
        }
    }
    handlePing(client) {
        client.emit('pong', { timestamp: new Date() });
    }
};
exports.BookingGateway = BookingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], BookingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleJoinBooking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleLeaveBooking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_booking_status'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleBookingStatusUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_booking_tracking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleTrackingRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('client_online'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleClientOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cleaner_available'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleCleanerAvailable", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handlePing", null);
exports.BookingGateway = BookingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:4028'],
            credentials: true,
        },
        namespace: '/bookings',
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService])
], BookingGateway);
//# sourceMappingURL=booking.gateway.js.map