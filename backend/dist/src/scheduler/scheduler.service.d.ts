import { PrismaService } from '../prisma/prisma.service';
export declare class SchedulerService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleBookingCleanup(): Promise<void>;
    handleCommissionProcessing(): Promise<void>;
    handleWalletMonitoring(): Promise<void>;
    handleFraudDetection(): Promise<void>;
    triggerBookingCleanup(): Promise<void>;
    triggerCommissionProcessing(): Promise<void>;
    triggerWalletMonitoring(): Promise<void>;
    triggerFraudDetection(): Promise<void>;
}
