export declare class HealthController {
    healthCheck(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
    };
    readinessCheck(): {
        status: string;
        timestamp: string;
    };
}
