import { PrismaService } from '../prisma/prisma.service';
import { BookingStatusService } from './booking-status.service';
import { BookingStatus, UserRole } from '@cleaning-marketplace/shared';
export declare class BookingsService {
    private prisma;
    private bookingStatusService;
    constructor(prisma: PrismaService, bookingStatusService: BookingStatusService);
    createBooking(clientUserId: string, bookingData: any): Promise<{
        distance: any;
        eta: any;
        cleanerService: {
            service: {
                category: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
            addons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                cleanerServiceId: string;
                url: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                liveLocation: {
                    lat: number;
                    lng: number;
                    updatedAt: Date;
                    cleanerUserId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        events: ({
            actor: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            bookingId: string;
            actorUserId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        reviews: {
            id: string;
            createdAt: Date;
            clientUserId: string;
            cleanerUserId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        }[];
        disputes: {
            id: string;
            status: import("@prisma/client").$Enums.DisputeStatus;
            createdAt: Date;
            bookingId: string;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    getBookings(userId: string, role: UserRole, filters?: any): Promise<({
        cleanerService: {
            service: {
                category: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        reviews: {
            id: string;
            createdAt: Date;
            clientUserId: string;
            cleanerUserId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        }[];
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    })[]>;
    getBookingById(bookingId: string, userId: string, role: UserRole): Promise<{
        distance: any;
        eta: any;
        cleanerService: {
            service: {
                category: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
            addons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                cleanerServiceId: string;
                url: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                liveLocation: {
                    lat: number;
                    lng: number;
                    updatedAt: Date;
                    cleanerUserId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        events: ({
            actor: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            bookingId: string;
            actorUserId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        reviews: {
            id: string;
            createdAt: Date;
            clientUserId: string;
            cleanerUserId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        }[];
        disputes: {
            id: string;
            status: import("@prisma/client").$Enums.DisputeStatus;
            createdAt: Date;
            bookingId: string;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus, userId: string, role: UserRole, meta?: any): Promise<{
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    assignBookingToCleaner(bookingId: string, cleanerUserId: string, adminUserId: string): Promise<{
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    cancelBooking(bookingId: string, userId: string, role: UserRole, reason?: string): Promise<{
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    confirmBooking(bookingId: string, clientUserId: string, reviewData?: any): Promise<{
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    createReview(bookingId: string, clientUserId: string, cleanerUserId: string, rating: number, comment?: string): Promise<{
        id: string;
        createdAt: Date;
        clientUserId: string;
        cleanerUserId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
    getBookingTracking(bookingId: string, userId: string, role: UserRole): Promise<{
        booking: {
            distance: any;
            eta: any;
            cleanerService: {
                service: {
                    category: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        description: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
                addons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerServiceId: string;
                    priceMad: number;
                    active: boolean;
                    name: string;
                    extraDurationMin: number;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    cleanerServiceId: string;
                    url: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            cleaner: {
                cleanerProfile: {
                    liveLocation: {
                        lat: number;
                        lng: number;
                        updatedAt: Date;
                        cleanerUserId: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerServiceId: string;
                    priceMad: number;
                    active: boolean;
                    name: string;
                    extraDurationMin: number;
                };
            } & {
                priceMad: number;
                bookingId: string;
                serviceAddonId: string;
            })[];
            events: ({
                actor: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        active: boolean;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                bookingId: string;
                actorUserId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
            reviews: {
                id: string;
                createdAt: Date;
                clientUserId: string;
                cleanerUserId: string;
                bookingId: string;
                rating: number;
                comment: string | null;
            }[];
            disputes: {
                id: string;
                status: import("@prisma/client").$Enums.DisputeStatus;
                createdAt: Date;
                bookingId: string;
                openedByUserId: string;
                reason: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
        };
        tracking: any;
        message: string;
    } | {
        booking: {
            distance: any;
            eta: any;
            cleanerService: {
                service: {
                    category: {
                        id: string;
                        createdAt: Date;
                        name: string;
                        description: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
                addons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerServiceId: string;
                    priceMad: number;
                    active: boolean;
                    name: string;
                    extraDurationMin: number;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    cleanerServiceId: string;
                    url: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            cleaner: {
                cleanerProfile: {
                    liveLocation: {
                        lat: number;
                        lng: number;
                        updatedAt: Date;
                        cleanerUserId: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cleanerServiceId: string;
                    priceMad: number;
                    active: boolean;
                    name: string;
                    extraDurationMin: number;
                };
            } & {
                priceMad: number;
                bookingId: string;
                serviceAddonId: string;
            })[];
            events: ({
                actor: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        defaultLocationId: string | null;
                    };
                    cleanerProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        active: boolean;
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                bookingId: string;
                actorUserId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
            reviews: {
                id: string;
                createdAt: Date;
                clientUserId: string;
                cleanerUserId: string;
                bookingId: string;
                rating: number;
                comment: string | null;
            }[];
            disputes: {
                id: string;
                status: import("@prisma/client").$Enums.DisputeStatus;
                createdAt: Date;
                bookingId: string;
                openedByUserId: string;
                reason: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
        };
        tracking: {
            cleanerLocation: {
                lat: number;
                lng: number;
                updatedAt: Date;
            };
            distance: number;
            eta: number;
            status: import("@prisma/client").$Enums.BookingStatus;
        };
        message?: undefined;
    }>;
    getCleanerBookings(cleanerUserId: string, status?: BookingStatus): Promise<({
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    })[]>;
    getPendingBookings(cleanerUserId: string): Promise<({
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                categoryId: string;
                description: string | null;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
            active: boolean;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerServiceId: string;
                priceMad: number;
                active: boolean;
                name: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
    } & {
        id: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    })[]>;
    getBookingAnalytics(dateFrom?: Date, dateTo?: Date): Promise<{
        totalBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        completionRate: number;
        avgBookingValue: number;
        bookingsByStatus: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.BookingGroupByOutputType, "status"[]> & {
            _count: {
                status: number;
            };
        })[];
        recentBookings: ({
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    categoryId: string;
                    description: string | null;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
                active: boolean;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    active: boolean;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
        } & {
            id: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
        })[];
    }>;
}
