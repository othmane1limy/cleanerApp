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
exports.PaypalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let PaypalService = class PaypalService {
    configService;
    baseUrl;
    clientId;
    clientSecret;
    constructor(configService) {
        this.configService = configService;
        const mode = this.configService.get('PAYPAL_MODE', 'sandbox');
        this.baseUrl = mode === 'sandbox'
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';
        this.clientId = this.configService.get('PAYPAL_CLIENT_ID');
        this.clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
    }
    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await axios_1.default.post(`${this.baseUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('PayPal access token error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to get PayPal access token');
        }
    }
    async createOrder(amount, currency = 'USD') {
        try {
            const accessToken = await this.getAccessToken();
            const usdAmount = currency === 'MAD' ? (amount / 10).toFixed(2) : amount.toFixed(2);
            const orderData = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: usdAmount,
                        },
                        description: 'Cleaning Marketplace Wallet Recharge',
                    },
                ],
                application_context: {
                    return_url: `${this.configService.get('FRONTEND_URL')}/payment/success`,
                    cancel_url: `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
                },
            };
            const response = await axios_1.default.post(`${this.baseUrl}/v2/checkout/orders`, orderData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('PayPal create order error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to create PayPal order');
        }
    }
    async captureOrder(orderId) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios_1.default.post(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('PayPal capture order error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to capture PayPal order');
        }
    }
    async verifyWebhook(headers, body) {
        try {
            const accessToken = await this.getAccessToken();
            const verificationData = {
                auth_algo: headers['paypal-auth-algo'],
                cert_id: headers['paypal-cert-id'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: this.configService.get('PAYPAL_WEBHOOK_ID'),
                webhook_event: body,
            };
            const response = await axios_1.default.post(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, verificationData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.verification_status === 'SUCCESS';
        }
        catch (error) {
            console.error('PayPal webhook verification error:', error.response?.data || error.message);
            return false;
        }
    }
    parsePaypalAmount(paypalAmount) {
        const usdAmount = parseFloat(paypalAmount);
        return Math.round(usdAmount * 10);
    }
    async getOrderDetails(orderId) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios_1.default.get(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('PayPal get order error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to get PayPal order details');
        }
    }
    formatAmount(amountMad) {
        return new Intl.NumberFormat('ar-MA', {
            style: 'currency',
            currency: 'MAD',
        }).format(amountMad);
    }
};
exports.PaypalService = PaypalService;
exports.PaypalService = PaypalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaypalService);
//# sourceMappingURL=paypal.service.js.map