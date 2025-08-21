import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaypalService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    const mode = this.configService.get('PAYPAL_MODE', 'sandbox');
    this.baseUrl = mode === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
    
    this.clientId = this.configService.get('PAYPAL_CLIENT_ID');
    this.clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
  }

  // ======================
  // PayPal API Integration
  // ======================

  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('PayPal access token error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to get PayPal access token');
    }
  }

  async createOrder(amount: number, currency = 'USD'): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      // Convert MAD to USD for PayPal (approximate rate)
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

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('PayPal create order error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('PayPal capture order error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to capture PayPal order');
    }
  }

  async verifyWebhook(headers: any, body: any): Promise<boolean> {
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

      const response = await axios.post(
        `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('PayPal webhook verification error:', error.response?.data || error.message);
      return false;
    }
  }

  // ======================
  // Helper Methods
  // ======================

  parsePaypalAmount(paypalAmount: string): number {
    // Convert USD back to MAD (approximate rate)
    const usdAmount = parseFloat(paypalAmount);
    return Math.round(usdAmount * 10); // Convert back to MAD
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('PayPal get order error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to get PayPal order details');
    }
  }

  formatAmount(amountMad: number): string {
    // Format MAD amount for display
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(amountMad);
  }
}
