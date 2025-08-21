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
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
let WebSocketService = class WebSocketService {
    prisma;
    server;
    constructor(prisma) {
        this.prisma = prisma;
    }
    setServer(server) {
        this.server = server;
    }
    async authenticateSocket(socket, token) {
        try {
            console.log('Socket authentication placeholder - implement JWT verification');
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
                client: true,
                cleaner: true,
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
                        cleaner: true,
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
    connectedClients = new Map();
    addClient(socket, userId, userType) {
        if (socket.user) {
            this.connectedClients.set(socket.id, socket);
            socket.join(`user:${userId}`);
            socket.join(`role:${userType}`);
        }
    }
    removeClient(socketId) {
        this.connectedClients.delete(socketId);
    }
    getUserIdFromSocket(socket) {
        return socket.user?.id || null;
    }
    async updateCleanerLocation(userId, locationData) {
        await this.prisma.cleanerProfile.update({
            where: { userId },
            data: {
                liveLocation: {
                    upsert: {
                        create: {
                            lat: locationData.lat,
                            lng: locationData.lng,
                        },
                        update: {
                            lat: locationData.lat,
                            lng: locationData.lng,
                        },
                    },
                },
            },
        });
        await this.broadcastCleanerLocation(userId, locationData.lat, locationData.lng);
    }
    async getNearbyCleaners(lat, lng, radius = 10, serviceId) {
        const cleaners = await this.prisma.cleanerProfile.findMany({
            where: {
                active: true,
                isVerified: true,
                ...(serviceId && {
                    services: {
                        some: {
                            serviceId,
                            active: true,
                        },
                    },
                }),
            },
            include: {
                baseLocation: true,
                services: serviceId ? {
                    where: { serviceId, active: true },
                } : true,
            },
        });
        const cleanerIds = cleaners.map(c => c.userId);
        const liveLocations = await this.prisma.cleanerLiveLocation.findMany({
            where: { cleanerUserId: { in: cleanerIds } },
        });
        const liveLocationMap = new Map(liveLocations.map(ll => [ll.cleanerUserId, ll]));
        const nearbyCleaners = cleaners
            .map((cleaner) => {
            const liveLocation = liveLocationMap.get(cleaner.userId);
            const cleanerLat = liveLocation?.lat || cleaner.baseLocation?.lat;
            const cleanerLng = liveLocation?.lng || cleaner.baseLocation?.lng;
            if (!cleanerLat || !cleanerLng)
                return null;
            const distance = this.calculateDistance(lat, lng, cleanerLat, cleanerLng);
            if (distance <= radius) {
                return {
                    ...cleaner,
                    distance,
                    eta: Math.round((distance / 30) * 60),
                };
            }
            return null;
        })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance);
        return nearbyCleaners;
    }
    async getBookingLocationStatus(bookingId, userId) {
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
                        cleanerProfile: {
                            include: {
                                baseLocation: true,
                            },
                        },
                    },
                },
            },
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        let cleanerLiveLocation = null;
        if (booking.cleanerUserId) {
            cleanerLiveLocation = await this.prisma.cleanerLiveLocation.findUnique({
                where: { cleanerUserId: booking.cleanerUserId },
            });
        }
        const cleanerLat = cleanerLiveLocation?.lat || booking.cleaner?.cleanerProfile?.baseLocation?.lat;
        const cleanerLng = cleanerLiveLocation?.lng || booking.cleaner?.cleanerProfile?.baseLocation?.lng;
        return {
            bookingId,
            status: booking.status,
            cleaner: booking.cleaner ? {
                id: booking.cleaner.id,
                name: booking.cleaner.cleanerProfile?.businessName || 'Unknown',
                location: cleanerLat && cleanerLng ? { lat: cleanerLat, lng: cleanerLng } : null,
            } : null,
            client: {
                id: booking.client.id,
                name: booking.client.clientProfile ?
                    `${booking.client.clientProfile.firstName} ${booking.client.clientProfile.lastName}` :
                    booking.client.email,
                location: booking.lat && booking.lng ?
                    { lat: booking.lat, lng: booking.lng } : null,
            },
            timestamp: new Date(),
        };
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
                Math.cos(this.toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map