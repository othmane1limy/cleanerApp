import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendVerificationEmail(email: string, otpCode: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}
