import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '@cleaning-marketplace/shared';
export declare class TestHelper {
    static createTestModule(imports?: any[], providers?: any[]): Promise<TestingModule>;
    static cleanupDatabase(prisma: PrismaService): Promise<void>;
    static createTestUser(prisma: PrismaService, authService: AuthService, role?: UserRole, overrides?: any): Promise<import("../auth/auth.service").AuthResponse>;
    static createTestBooking(prisma: PrismaService, clientUserId: string, cleanerServiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date;
        addressText: string;
        lat: number;
        lng: number;
        basePriceMad: number;
        addonsTotal: number;
        totalPriceMad: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        clientUserId: string;
        cleanerUserId: string | null;
        cleanerServiceId: string;
    }>;
    static createTestService(prisma: PrismaService, cleanerUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        cleanerUserId: string;
        priceMad: number;
        serviceId: string;
    }>;
    static mockLocation(): {
        lat: number;
        lng: number;
        addressText: string;
    };
    static mockPaypalOrder(): {
        id: string;
        status: string;
        purchase_units: {
            payments: {
                captures: {
                    id: string;
                    amount: {
                        value: string;
                        currency_code: string;
                    };
                    create_time: string;
                }[];
            };
        }[];
        links: {
            rel: string;
            href: string;
        }[];
    };
    static waitFor(condition: () => Promise<boolean>, timeout?: number): Promise<boolean>;
}
