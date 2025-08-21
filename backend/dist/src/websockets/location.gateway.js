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
exports.LocationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const websocket_service_1 = require("./websocket.service");
let LocationGateway = class LocationGateway {
    webSocketService;
    server;
    logger = new common_1.Logger('LocationGateway');
    constructor(webSocketService) {
        this.webSocketService = webSocketService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.webSocketService.removeClient(client.id);
    }
    async handleJoinLocationUpdates(client, data) {
        try {
            await this.webSocketService.addClient(client, data.userId, data.userType);
            client.emit('joined_location_updates', { success: true });
            this.logger.log(`User ${data.userId} joined location updates`);
        }
        catch (error) {
            this.logger.error('Error joining location updates:', error);
            client.emit('joined_location_updates', { success: false, error: error.message });
        }
    }
    async handleUpdateCleanerLocation(client, data) {
        try {
            const userId = await this.webSocketService.getUserIdFromSocket(client);
            await this.webSocketService.updateCleanerLocation(userId, data);
            client.emit('location_updated', { success: true });
            this.logger.log(`Updated location for cleaner ${userId}`);
        }
        catch (error) {
            this.logger.error('Error updating cleaner location:', error);
            client.emit('location_updated', { success: false, error: error.message });
        }
    }
    async handleGetNearbyCleaner(client, data) {
        try {
            const userId = await this.webSocketService.getUserIdFromSocket(client);
            const nearbyCleaners = await this.webSocketService.getNearbyCleaners(data.latitude, data.longitude, data.radius, data.serviceId);
            client.emit('nearby_cleaners', { cleaners: nearbyCleaners });
            this.logger.log(`Sent nearby cleaners to user ${userId}`);
        }
        catch (error) {
            this.logger.error('Error getting nearby cleaners:', error);
            client.emit('nearby_cleaners', { cleaners: [], error: error.message });
        }
    }
    async handleTrackBookingLocation(client, data) {
        try {
            const userId = await this.webSocketService.getUserIdFromSocket(client);
            client.join(`booking_${data.bookingId}`);
            const locationStatus = await this.webSocketService.getBookingLocationStatus(data.bookingId, userId);
            client.emit('booking_location_status', locationStatus);
            this.logger.log(`User ${userId} started tracking booking ${data.bookingId}`);
        }
        catch (error) {
            this.logger.error('Error tracking booking location:', error);
            client.emit('booking_location_status', { error: error.message });
        }
    }
    async handleStopTrackingBooking(client, data) {
        try {
            const userId = await this.webSocketService.getUserIdFromSocket(client);
            client.leave(`booking_${data.bookingId}`);
            client.emit('stopped_tracking', { bookingId: data.bookingId });
            this.logger.log(`User ${userId} stopped tracking booking ${data.bookingId}`);
        }
        catch (error) {
            this.logger.error('Error stopping booking tracking:', error);
            client.emit('stopped_tracking', { error: error.message });
        }
    }
    async broadcastLocationUpdate(bookingId, locationData) {
        this.server.to(`booking_${bookingId}`).emit('location_update', {
            bookingId,
            ...locationData,
        });
    }
    async notifyCleanerAvailability(cleanerId, isAvailable, location) {
        this.server.emit('cleaner_availability_changed', {
            cleanerId,
            isAvailable,
            location,
        });
    }
};
exports.LocationGateway = LocationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LocationGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('join_location_updates'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleJoinLocationUpdates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('update_cleaner_location'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleUpdateCleanerLocation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('get_nearby_cleaners'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleGetNearbyCleaner", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('track_booking_location'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleTrackBookingLocation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('stop_tracking_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleStopTrackingBooking", null);
exports.LocationGateway = LocationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/location',
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService])
], LocationGateway);
//# sourceMappingURL=location.gateway.js.map