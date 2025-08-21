import { ConfigService } from '@nestjs/config';
export declare class PaypalService {
    private configService;
    private readonly baseUrl;
    private readonly clientId;
    private readonly clientSecret;
    constructor(configService: ConfigService);
    getAccessToken(): Promise<string>;
    createOrder(amount: number, currency?: string): Promise<any>;
    captureOrder(orderId: string): Promise<any>;
    verifyWebhook(headers: any, body: any): Promise<boolean>;
    parsePaypalAmount(paypalAmount: string): number;
    getOrderDetails(orderId: string): Promise<any>;
    formatAmount(amountMad: number): string;
}
