import { BookingsService } from './bookings.service';
import { BookingStatusService } from './booking-status.service';
import { BookingStatus } from '@cleaning-marketplace/shared';
export declare class BookingsController {
    private readonly bookingsService;
    private readonly bookingStatusService;
    constructor(bookingsService: BookingsService, bookingStatusService: BookingStatusService);
    createBooking(req: any, bookingData: any): Promise<{
        distance: any;
        eta: any;
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                liveLocation: {
                    updatedAt: Date;
                    cleanerUserId: string;
                    lat: number;
                    lng: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            addons: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
                extraDurationMin: number;
            }[];
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
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
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
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
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
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            actorUserId: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            bookingId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
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
            createdAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    getBookings(req: any, filters: any): Promise<({
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
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
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
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
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    })[]>;
    getBookingById(req: any, bookingId: string): Promise<{
        distance: any;
        eta: any;
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                liveLocation: {
                    updatedAt: Date;
                    cleanerUserId: string;
                    lat: number;
                    lng: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            addons: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
                extraDurationMin: number;
            }[];
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
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
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
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
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
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            actorUserId: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            bookingId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
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
            createdAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            openedByUserId: string;
            reason: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    updateBookingStatus(req: any, bookingId: string, body: {
        status: BookingStatus;
        meta?: any;
    }): Promise<{
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    confirmBooking(req: any, bookingId: string, reviewData?: {
        rating?: number;
        comment?: string;
    }): Promise<{
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    cancelBooking(req: any, bookingId: string, body?: {
        reason?: string;
    }): Promise<{
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    getBookingTracking(req: any, bookingId: string): Promise<{
        booking: {
            distance: any;
            eta: any;
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
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleaner: {
                cleanerProfile: {
                    liveLocation: {
                        updatedAt: Date;
                        cleanerUserId: string;
                        lat: number;
                        lng: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleanerService: {
                addons: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    active: boolean;
                    cleanerServiceId: string;
                    priceMad: number;
                    extraDurationMin: number;
                }[];
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
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
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
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    active: boolean;
                    cleanerServiceId: string;
                    priceMad: number;
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
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        active: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    updatedAt: Date;
                };
            } & {
                id: string;
                actorUserId: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                bookingId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
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
                createdAt: Date;
                status: import("@prisma/client").$Enums.DisputeStatus;
                bookingId: string;
                openedByUserId: string;
                reason: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
        };
        tracking: any;
        message: string;
    } | {
        booking: {
            distance: any;
            eta: any;
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
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleaner: {
                cleanerProfile: {
                    liveLocation: {
                        updatedAt: Date;
                        cleanerUserId: string;
                        lat: number;
                        lng: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleanerService: {
                addons: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    active: boolean;
                    cleanerServiceId: string;
                    priceMad: number;
                    extraDurationMin: number;
                }[];
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
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
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
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    active: boolean;
                    cleanerServiceId: string;
                    priceMad: number;
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
                        userId: string;
                        businessName: string;
                        bio: string | null;
                        ratingAvg: number;
                        ratingCount: number;
                        isVerified: boolean;
                        active: boolean;
                        baseLocationId: string | null;
                        completedJobsCount: number;
                        freeJobsUsed: number;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    updatedAt: Date;
                };
            } & {
                id: string;
                actorUserId: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                bookingId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
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
                createdAt: Date;
                status: import("@prisma/client").$Enums.DisputeStatus;
                bookingId: string;
                openedByUserId: string;
                reason: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
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
    getBookingHistory(req: any, bookingId: string): Promise<({
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
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
    } & {
        id: string;
        actorUserId: string;
        createdAt: Date;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        bookingId: string;
        oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
        newStatus: import("@prisma/client").$Enums.BookingStatus;
    })[]>;
    getPendingBookings(req: any): Promise<({
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    })[]>;
    getCleanerBookings(req: any, status?: BookingStatus): Promise<({
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleanerService: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            cleanerUserId: string;
            serviceId: string;
            priceMad: number;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                active: boolean;
                cleanerServiceId: string;
                priceMad: number;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    })[]>;
    assignBooking(req: any, bookingId: string, body: {
        cleanerUserId: string;
    }): Promise<{
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
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
        cleaner: {
            cleanerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                businessName: string;
                bio: string | null;
                ratingAvg: number;
                ratingCount: number;
                isVerified: boolean;
                active: boolean;
                baseLocationId: string | null;
                completedJobsCount: number;
                freeJobsUsed: number;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    getBookingAnalytics(dateFrom?: string, dateTo?: string): Promise<{
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
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleaner: {
                cleanerProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    businessName: string;
                    bio: string | null;
                    ratingAvg: number;
                    ratingCount: number;
                    isVerified: boolean;
                    active: boolean;
                    baseLocationId: string | null;
                    completedJobsCount: number;
                    freeJobsUsed: number;
                };
            } & {
                id: string;
                createdAt: Date;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                updatedAt: Date;
            };
            cleanerService: {
                service: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                cleanerUserId: string;
                serviceId: string;
                priceMad: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientUserId: string;
            cleanerUserId: string | null;
            cleanerServiceId: string;
            scheduledAt: Date;
            addressText: string;
            lat: number;
            lng: number;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
            status: import("@prisma/client").$Enums.BookingStatus;
        })[];
    }>;
}
