import { PrismaService } from '../prisma/prisma.service';
import { VerificationDocumentStatus } from '@cleaning-marketplace/shared';
export declare class VerificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getPendingVerifications(): Promise<unknown[]>;
    getCleanerVerificationStatus(cleanerUserId: string): Promise<{
        cleaner: {
            user: {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            services: ({
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
            })[];
            verificationDocuments: {
                id: string;
                createdAt: Date;
                cleanerUserId: string;
                type: string;
                url: string;
                status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                reviewedBy: string | null;
                reviewedAt: Date | null;
            }[];
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
        verificationStatus: {
            isVerified: boolean;
            hasAllRequiredDocuments: boolean;
            documentsCount: {
                total: number;
                approved: number;
                rejected: number;
                pending: number;
            };
            requiredDocuments: {
                type: string;
                status: string;
                document: {
                    id: string;
                    createdAt: Date;
                    cleanerUserId: string;
                    type: string;
                    url: string;
                    status: import("@prisma/client").$Enums.VerificationDocumentStatus;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                };
            }[];
        };
        documents: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            type: string;
            url: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
    }>;
    reviewVerificationDocument(documentId: string, adminUserId: string, status: VerificationDocumentStatus, reason?: string): Promise<{
        cleaner: {
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
        reviewer: {
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
        cleanerUserId: string;
        type: string;
        url: string;
        status: import("@prisma/client").$Enums.VerificationDocumentStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    verifyCleaner(cleanerUserId: string, adminUserId: string, verified: boolean, reason?: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        verificationDocuments: {
            id: string;
            createdAt: Date;
            cleanerUserId: string;
            type: string;
            url: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
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
    }>;
    getVerificationStatistics(): Promise<{
        totalCleaners: number;
        verifiedCleaners: number;
        pendingVerifications: number;
        rejectedCleaners: number;
        verificationRate: number;
        documentsCount: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VerificationDocumentGroupByOutputType, "status"[]> & {
            _count: {
                status: number;
            };
        })[];
        recentVerifications: ({
            cleaner: {
                user: {
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
            reviewer: {
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
            cleanerUserId: string;
            type: string;
            url: string;
            status: import("@prisma/client").$Enums.VerificationDocumentStatus;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        })[];
    }>;
    private checkCleanerVerificationStatus;
    bulkVerifyCleaners(cleanerIds: string[], adminUserId: string, verified: boolean, reason?: string): Promise<{
        processed: number;
        successful: number;
        failed: number;
        results: any[];
    }>;
    getVerificationMetrics(dateFrom?: Date, dateTo?: Date): Promise<{
        verificationTrends: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VerificationDocumentGroupByOutputType, "status"[]> & {
            _count: {
                status: number;
            };
        })[];
        dailyVerifications: unknown;
    }>;
}
