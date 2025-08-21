"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHelper = void 0;
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@cleaning-marketplace/shared");
class TestHelper {
    static async createTestModule(imports = [], providers = []) {
        const module = await testing_1.Test.createTestingModule({
            imports,
            providers: [prisma_service_1.PrismaService, ...providers],
        }).compile();
        return module;
    }
    static async cleanupDatabase(prisma) {
        const tablenames = [
            'booking_events',
            'booking_addons',
            'reviews',
            'bookings',
            'service_photos',
            'service_addons',
            'cleaner_services',
            'services',
            'service_categories',
            'verification_documents',
            'cleaner_live_locations',
            'locations',
            'wallet_transactions',
            'commissions',
            'wallets',
            'debt_thresholds',
            'disputes',
            'support_tickets',
            'fraud_flags',
            'audit_logs',
            'email_otps',
            'sessions',
            'devices',
            'cleaner_profiles',
            'client_profiles',
            'users',
        ];
        for (const tablename of tablenames) {
            try {
                await prisma.$executeRawUnsafe(`DELETE FROM "${tablename}";`);
            }
            catch (error) {
                console.log(`Could not clear ${tablename}:`, error);
            }
        }
    }
    static async createTestUser(prisma, authService, role = shared_1.UserRole.CLIENT, overrides = {}) {
        const baseData = {
            email: `test-${Date.now()}@example.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            businessName: 'Test Business',
            ...overrides,
        };
        if (role === shared_1.UserRole.CLIENT) {
            return authService.registerClient(baseData);
        }
        else if (role === shared_1.UserRole.CLEANER) {
            return authService.registerCleaner(baseData);
        }
        throw new Error('Unsupported user role for test creation');
    }
    static async createTestBooking(prisma, clientUserId, cleanerServiceId) {
        return prisma.booking.create({
            data: {
                clientUserId,
                cleanerServiceId,
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                addressText: 'Test Address, Casablanca',
                lat: 33.5731,
                lng: -7.5898,
                basePriceMad: 100,
                addonsTotal: 0,
                totalPriceMad: 100,
                status: 'REQUESTED',
            },
        });
    }
    static async createTestService(prisma, cleanerUserId) {
        const category = await prisma.serviceCategory.create({
            data: {
                name: 'Test Category',
                description: 'Test category for testing',
            },
        });
        const service = await prisma.service.create({
            data: {
                categoryId: category.id,
                name: 'Test Service',
                description: 'Test service for testing',
                baseDurationMin: 60,
            },
        });
        return prisma.cleanerService.create({
            data: {
                cleanerUserId,
                serviceId: service.id,
                priceMad: 100,
                active: true,
            },
        });
    }
    static mockLocation() {
        return {
            lat: 33.5731,
            lng: -7.5898,
            addressText: 'Casablanca, Morocco',
        };
    }
    static mockPaypalOrder() {
        return {
            id: 'PAYPAL_ORDER_' + Date.now(),
            status: 'COMPLETED',
            purchase_units: [
                {
                    payments: {
                        captures: [
                            {
                                id: 'CAPTURE_' + Date.now(),
                                amount: { value: '50.00', currency_code: 'USD' },
                                create_time: new Date().toISOString(),
                            },
                        ],
                    },
                },
            ],
            links: [
                {
                    rel: 'approve',
                    href: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_' + Date.now(),
                },
            ],
        };
    }
    static async waitFor(condition, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (await condition()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('Timeout waiting for condition');
    }
}
exports.TestHelper = TestHelper;
beforeEach(async () => {
});
afterEach(async () => {
});
//# sourceMappingURL=setup.js.map