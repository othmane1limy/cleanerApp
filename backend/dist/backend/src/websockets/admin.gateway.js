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
exports.AdminGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const role_guard_2 = require("../auth/guards/role.guard");
const types_1 = require("../../../shared/src/types");
let AdminGateway = class AdminGateway {
    server;
    logger = new common_1.Logger('AdminGateway');
    constructor() { }
    handleConnection(client) {
        this.logger.log(`Admin client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Admin client disconnected: ${client.id}`);
    }
    async handleJoinAdminNotifications(client, data) {
        try {
            client.join('admin_notifications');
            client.emit('joined_admin_notifications', { success: true });
            this.logger.log(`Admin ${data.userId} joined notifications`);
        }
        catch (error) {
            this.logger.error('Error joining admin notifications:', error);
            client.emit('joined_admin_notifications', { success: false, error: error.message });
        }
    }
    async handleGetRealTimeStats(client, data) {
        try {
            const stats = {
                activeBookings: 0,
                availableCleaners: 0,
                totalRevenue: 0,
                pendingDisputes: 0,
            };
            client.emit('real_time_stats', stats);
            this.logger.log(`Sent real-time stats to admin`);
        }
        catch (error) {
            this.logger.error('Error getting real-time stats:', error);
            client.emit('real_time_stats', { error: error.message });
        }
    }
    async handleMonitorBooking(client, data) {
        try {
            client.join(`admin_monitor_${data.bookingId}`);
            client.emit('monitoring_booking', { bookingId: data.bookingId, success: true });
            this.logger.log(`Admin monitoring booking ${data.bookingId}`);
        }
        catch (error) {
            this.logger.error('Error monitoring booking:', error);
            client.emit('monitoring_booking', { error: error.message });
        }
    }
    async handleStopMonitoringBooking(client, data) {
        try {
            client.leave(`admin_monitor_${data.bookingId}`);
            client.emit('stopped_monitoring_booking', { bookingId: data.bookingId });
            this.logger.log(`Admin stopped monitoring booking ${data.bookingId}`);
        }
        catch (error) {
            this.logger.error('Error stopping booking monitoring:', error);
            client.emit('stopped_monitoring_booking', { error: error.message });
        }
    }
    async handleSendSystemNotification(client, data) {
        try {
            if (data.targetUserId) {
                this.server.emit('system_notification', {
                    message: data.message,
                    type: data.type,
                    timestamp: new Date().toISOString(),
                });
            }
            else if (data.targetRole) {
                this.server.emit('system_notification', {
                    message: data.message,
                    type: data.type,
                    role: data.targetRole,
                    timestamp: new Date().toISOString(),
                });
            }
            else {
                this.server.emit('system_notification', {
                    message: data.message,
                    type: data.type,
                    timestamp: new Date().toISOString(),
                });
            }
            client.emit('notification_sent', { success: true });
            this.logger.log(`Admin sent system notification: ${data.message}`);
        }
        catch (error) {
            this.logger.error('Error sending system notification:', error);
            client.emit('notification_sent', { success: false, error: error.message });
        }
    }
    async notifyAdmins(event, data) {
        this.server.to('admin_notifications').emit('admin_alert', {
            event,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    async sendFraudAlert(alertData) {
        this.server.to('admin_notifications').emit('fraud_alert', {
            ...alertData,
            timestamp: new Date().toISOString(),
            severity: 'high',
        });
    }
    async sendBookingAlert(bookingId, alertType, data) {
        this.server.to('admin_notifications').emit('booking_alert', {
            bookingId,
            alertType,
            data,
            timestamp: new Date().toISOString(),
        });
        this.server.to(`admin_monitor_${bookingId}`).emit('booking_update', {
            bookingId,
            alertType,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    async broadcastMaintenanceNotification(message, scheduledTime) {
        this.server.emit('maintenance_notification', {
            message,
            scheduledTime,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.AdminGateway = AdminGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AdminGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_2.Roles)(types_1.UserRole.ADMIN),
    (0, websockets_1.SubscribeMessage)('join_admin_notifications'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "handleJoinAdminNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_2.Roles)(types_1.UserRole.ADMIN),
    (0, websockets_1.SubscribeMessage)('get_real_time_stats'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "handleGetRealTimeStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_2.Roles)(types_1.UserRole.ADMIN),
    (0, websockets_1.SubscribeMessage)('monitor_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "handleMonitorBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_2.Roles)(types_1.UserRole.ADMIN),
    (0, websockets_1.SubscribeMessage)('stop_monitoring_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "handleStopMonitoringBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, role_guard_2.Roles)(types_1.UserRole.ADMIN),
    (0, websockets_1.SubscribeMessage)('send_system_notification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "handleSendSystemNotification", null);
exports.AdminGateway = AdminGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/admin',
    }),
    __metadata("design:paramtypes", [])
], AdminGateway);
//# sourceMappingURL=admin.gateway.js.map