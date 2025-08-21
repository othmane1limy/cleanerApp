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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
let WebSocketService = class WebSocketService {
    jwtService;
    prisma;
    server;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    setServer(server) {
        this.server = server;
    }
    async authenticateSocket(socket, token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    emailVerified: true,
                },
            });
            if (!user || !user.emailVerified) {
                return false;
            }
            socket.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            return true;
        }
        catch (error) {
            console.error('Socket authentication failed:', error);
            return false;
        }
    }
    joinUserRoom(socket) {
        if (socket.user) {
            socket.join(`user:${socket.user.id}`);
            socket.join(`role:${socket.user.role}`);
            console.log(`User ${socket.user.id} (${socket.user.role}) joined rooms`);
        }
    }
    joinBookingRoom(socket, bookingId) {
        socket.join(`booking:${bookingId}`);
        console.log(`User ${socket.user?.id} joined booking room: ${bookingId}`);
    }
    leaveBookingRoom(socket, bookingId) {
        socket.leave(`booking:${bookingId}`);
        console.log(`User ${socket.user?.id} left booking room: ${bookingId}`);
    }
    async notifyBookingStatusUpdate(bookingId, oldStatus, newStatus, actor) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: {
                    include: {
                        clientProfile: true,
                    },
                },
                cleaner: {
                    include: {
                        cleanerProfile: true,
                    },
                },
                cleanerService: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        if (!booking) {
            return;
        }
        const notification = {
            type: 'BOOKING_STATUS_UPDATE',
            bookingId,
            oldStatus,
            newStatus,
            booking,
            actor,
            timestamp: new Date(),
        };
        this.server.to(`booking:${bookingId}`).emit('booking_status_update', notification);
        this.server.to(`user:${booking.clientUserId}`).emit('booking_update', notification);
        if (booking.cleanerUserId) {
            this.server.to(`user:${booking.cleanerUserId}`).emit('booking_update', notification);
        }
        this.server.to('role:ADMIN').emit('admin_booking_update', notification);
    }
    async notifyNewBookingRequest(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: {
                    include: {
                        clientProfile: true,
                    },
                },
                cleanerService: {
                    include: {
                        service: true,
                        cleaner: {
                            include: {
                                user: true,
                                cleanerProfile: true,
                            },
                        },
                    },
                },
            },
        });
        if (!booking) {
            return;
        }
        const notification = {
            type: 'NEW_BOOKING_REQUEST',
            bookingId,
            booking,
            timestamp: new Date(),
        };
        if (booking.cleanerUserId) {
            this.server.to(`user:${booking.cleanerUserId}`).emit('new_booking', notification);
        }
        this.server.to('role:ADMIN').emit('admin_new_booking', notification);
    }
    async broadcastCleanerLocation(cleanerUserId, lat, lng) {
        const activeBookings = await this.prisma.booking.findMany({
            where: {
                cleanerUserId,
                status: {
                    in: [shared_1.BookingStatus.ACCEPTED, shared_1.BookingStatus.ON_THE_WAY, shared_1.BookingStatus.ARRIVED, shared_1.BookingStatus.IN_PROGRESS],
                },
            },
        });
        const locationUpdate = {
            type: 'CLEANER_LOCATION_UPDATE',
            cleanerUserId,
            location: { lat, lng },
            timestamp: new Date(),
        };
        activeBookings.forEach((booking) => {
            this.server.to(`user:${booking.clientUserId}`).emit('cleaner_location_update', {
                ...locationUpdate,
                bookingId: booking.id,
            });
        });
        this.server.to('role:ADMIN').emit('admin_location_update', locationUpdate);
    }
    notifyWalletUpdate(cleanerUserId, oldBalance, newBalance, transaction) {
        const notification = {
            type: 'WALLET_UPDATE',
            oldBalance,
            newBalance,
            transaction,
            timestamp: new Date(),
        };
        this.server.to(`user:${cleanerUserId}`).emit('wallet_update', notification);
        if (Math.abs(newBalance - oldBalance) > 100) {
            this.server.to('role:ADMIN').emit('admin_wallet_update', {
                ...notification,
                cleanerUserId,
            });
        }
    }
    notifyCommissionDeducted(cleanerUserId, bookingId, commissionAmount) {
        const notification = {
            type: 'COMMISSION_DEDUCTED',
            bookingId,
            commissionAmount,
            timestamp: new Date(),
        };
        this.server.to(`user:${cleanerUserId}`).emit('commission_deducted', notification);
    }
    notifyAdminAlert(type, data, severity = 'INFO') {
        const notification = {
            type: 'ADMIN_ALERT',
            alertType: type,
            severity,
            data,
            timestamp: new Date(),
        };
        this.server.to('role:ADMIN').emit('admin_alert', notification);
    }
    notifyNewDispute(disputeId, dispute) {
        const notification = {
            type: 'NEW_DISPUTE',
            disputeId,
            dispute,
            timestamp: new Date(),
        };
        this.server.to('role:ADMIN').emit('new_dispute', notification);
    }
    notifyVerificationRequired(cleanerUserId, document) {
        const notification = {
            type: 'VERIFICATION_REQUIRED',
            cleanerUserId,
            document,
            timestamp: new Date(),
        };
        this.server.to('role:ADMIN').emit('verification_required', notification);
    }
    sendNotificationToUser(userId, type, data) {
        const notification = {
            type,
            data,
            timestamp: new Date(),
        };
        this.server.to(`user:${userId}`).emit('notification', notification);
    }
    sendNotificationToRole(role, type, data) {
        const notification = {
            type,
            data,
            timestamp: new Date(),
        };
        this.server.to(`role:${role}`).emit('role_notification', notification);
    }
    broadcastSystemNotification(type, message, severity = 'INFO') {
        const notification = {
            type: 'SYSTEM_NOTIFICATION',
            notificationType: type,
            message,
            severity,
            timestamp: new Date(),
        };
        this.server.emit('system_notification', notification);
    }
    getConnectedUsersCount() {
        return this.server?.sockets.sockets.size || 0;
    }
    getUserConnections(userId) {
        const room = this.server?.sockets.adapter.rooms.get(`user:${userId}`);
        return room?.size || 0;
    }
    async getOnlineCleaners() {
        const cleanerRoom = this.server?.sockets.adapter.rooms.get('role:CLEANER');
        const onlineCleanerSockets = Array.from(cleanerRoom || []);
        const onlineCleaners = [];
        for (const socketId of onlineCleanerSockets) {
            const socket = this.server?.sockets.sockets.get(socketId);
            if (socket?.user?.role === shared_1.UserRole.CLEANER) {
                onlineCleaners.push(socket.user.id);
            }
        }
        return onlineCleaners;
    }
    getConnectionStats() {
        const totalConnections = this.getConnectedUsersCount();
        const clientRoom = this.server?.sockets.adapter.rooms.get('role:CLIENT');
        const cleanerRoom = this.server?.sockets.adapter.rooms.get('role:CLEANER');
        const adminRoom = this.server?.sockets.adapter.rooms.get('role:ADMIN');
        return {
            totalConnections,
            clientConnections: clientRoom?.size || 0,
            cleanerConnections: cleanerRoom?.size || 0,
            adminConnections: adminRoom?.size || 0,
            timestamp: new Date(),
        };
    }
    async canAccessBooking(bookingId, userId, role) {
        try {
            const booking = await this.prisma.booking.findUnique({
                where: { id: bookingId },
                select: {
                    clientUserId: true,
                    cleanerUserId: true,
                },
            });
            if (!booking) {
                return false;
            }
            if (role === shared_1.UserRole.ADMIN) {
                return true;
            }
            return booking.clientUserId === userId || booking.cleanerUserId === userId;
        }
        catch (error) {
            console.error('Error checking booking access:', error);
            return false;
        }
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map