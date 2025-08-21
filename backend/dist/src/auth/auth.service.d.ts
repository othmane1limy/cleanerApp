import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { UserRole } from '@cleaning-marketplace/shared';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
    };
    profile?: any;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    registerClient(registerData: any): Promise<AuthResponse>;
    registerCleaner(registerData: any): Promise<AuthResponse>;
    login(loginData: any): Promise<AuthResponse>;
    verifyEmail(verificationData: any): Promise<{
        success: boolean;
    }>;
    refreshToken(refreshToken: string): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>;
    logout(userId: string, refreshToken?: string): Promise<{
        success: boolean;
    }>;
    private generateTokens;
    private sendVerificationEmail;
    private logAuditEvent;
    validateUser(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            defaultLocationId: string | null;
        } | {
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
            baseLocationId: string | null;
            completedJobsCount: number;
            freeJobsUsed: number;
        };
    }>;
}
