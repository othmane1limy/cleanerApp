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
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
            addons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                url: string;
                cleanerServiceId: string;
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        events: ({
            actor: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
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
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            actorUserId: string;
            bookingId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
        })[];
        reviews: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            bookingId: string;
            clientUserId: string;
            rating: number;
            comment: string | null;
        }[];
        disputes: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            openedByUserId: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            bookingId: string;
            clientUserId: string;
            rating: number;
            comment: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
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
                description: string | null;
                categoryId: string;
                baseDurationMin: number;
            };
            addons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                url: string;
                cleanerServiceId: string;
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        addons: ({
            serviceAddon: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        events: ({
            actor: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
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
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            actorUserId: string;
            bookingId: string;
            oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
            newStatus: import("@prisma/client").$Enums.BookingStatus;
        })[];
        reviews: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            bookingId: string;
            clientUserId: string;
            rating: number;
            comment: string | null;
        }[];
        disputes: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            openedByUserId: string;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolutionNote: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus, userId: string, role: UserRole, meta?: any): Promise<{
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    assignBookingToCleaner(bookingId: string, cleanerUserId: string, adminUserId: string): Promise<{
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    cancelBooking(bookingId: string, userId: string, role: UserRole, reason?: string): Promise<{
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    confirmBooking(bookingId: string, clientUserId: string, reviewData?: any): Promise<{
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
                completedJobsCount: number;
                freeJobsUsed: number;
                baseLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    }>;
    createReview(bookingId: string, clientUserId: string, cleanerUserId: string, rating: number, comment?: string): Promise<{
        id: string;
        createdAt: Date;
        cleanerUserId: string;
        bookingId: string;
        clientUserId: string;
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
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
                addons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    active: boolean;
                    priceMad: number;
                    cleanerServiceId: string;
                    extraDurationMin: number;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    cleanerServiceId: string;
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
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    active: boolean;
                    priceMad: number;
                    cleanerServiceId: string;
                    extraDurationMin: number;
                };
            } & {
                priceMad: number;
                bookingId: string;
                serviceAddonId: string;
            })[];
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            events: ({
                actor: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        userId: string;
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
                        completedJobsCount: number;
                        freeJobsUsed: number;
                        baseLocationId: string | null;
                    };
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                actorUserId: string;
                bookingId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
            })[];
            reviews: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                bookingId: string;
                clientUserId: string;
                rating: number;
                comment: string | null;
            }[];
            disputes: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.DisputeStatus;
                bookingId: string;
                reason: string;
                openedByUserId: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
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
                    description: string | null;
                    categoryId: string;
                    baseDurationMin: number;
                };
                addons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    active: boolean;
                    priceMad: number;
                    cleanerServiceId: string;
                    extraDurationMin: number;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    cleanerServiceId: string;
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
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            addons: ({
                serviceAddon: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    active: boolean;
                    priceMad: number;
                    cleanerServiceId: string;
                    extraDurationMin: number;
                };
            } & {
                priceMad: number;
                bookingId: string;
                serviceAddonId: string;
            })[];
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            events: ({
                actor: {
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        firstName: string;
                        lastName: string;
                        avatarUrl: string | null;
                        userId: string;
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
                        completedJobsCount: number;
                        freeJobsUsed: number;
                        baseLocationId: string | null;
                    };
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    passwordHash: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                meta: import("@prisma/client/runtime/library").JsonValue | null;
                actorUserId: string;
                bookingId: string;
                oldStatus: import("@prisma/client").$Enums.BookingStatus | null;
                newStatus: import("@prisma/client").$Enums.BookingStatus;
            })[];
            reviews: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                bookingId: string;
                clientUserId: string;
                rating: number;
                comment: string | null;
            }[];
            disputes: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.DisputeStatus;
                bookingId: string;
                reason: string;
                openedByUserId: string;
                resolvedAt: Date | null;
                resolvedBy: string | null;
                resolutionNote: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
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
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
    })[]>;
    getPendingBookings(cleanerUserId: string): Promise<({
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
                updatedAt: Date;
                name: string;
                active: boolean;
                priceMad: number;
                cleanerServiceId: string;
                extraDurationMin: number;
            };
        } & {
            priceMad: number;
            bookingId: string;
            serviceAddonId: string;
        })[];
        client: {
            clientProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                userId: string;
                defaultLocationId: string | null;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cleanerUserId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        lat: number;
        lng: number;
        addressText: string;
        clientUserId: string;
        cleanerServiceId: string;
        scheduledAt: Date;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
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
                    completedJobsCount: number;
                    freeJobsUsed: number;
                    baseLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    userId: string;
                    defaultLocationId: string | null;
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cleanerUserId: string | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            lat: number;
            lng: number;
            addressText: string;
            clientUserId: string;
            cleanerServiceId: string;
            scheduledAt: Date;
            basePriceMad: number;
            addonsTotal: number;
            totalPriceMad: number;
        })[];
    }>;
}
