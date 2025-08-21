import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, otpCode: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject: 'Verify your email - Cleaning Marketplace',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Email Verification</h1>
          <p>Welcome to our Cleaning Services Marketplace!</p>
          <p>To complete your registration, please use the verification code below:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h2>
          </div>
          
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent from Cleaning Services Marketplace.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
        Welcome to our Cleaning Services Marketplace!
        
        To complete your registration, please use this verification code: ${otpCode}
        
        This code will expire in 10 minutes.
        If you didn't create an account, you can safely ignore this email.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject: 'Password Reset - Cleaning Marketplace',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Password Reset</h1>
          <p>You requested a password reset for your Cleaning Services Marketplace account.</p>
          <p>Click the link below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent from Cleaning Services Marketplace.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
        You requested a password reset for your Cleaning Services Marketplace account.
        
        Click this link to reset your password: ${resetUrl}
        
        This link will expire in 1 hour.
        If you didn't request a password reset, you can safely ignore this email.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}
