import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerClient(registerData: any): Promise<import("./auth.service").AuthResponse>;
    registerCleaner(registerData: any): Promise<import("./auth.service").AuthResponse>;
    login(loginData: any): Promise<import("./auth.service").AuthResponse>;
    verifyEmail(verificationData: any): Promise<{
        success: boolean;
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): Promise<Pick<import("./auth.service").AuthResponse, "accessToken" | "refreshToken">>;
    logout(req: any, body?: {
        refreshToken?: string;
    }): Promise<{
        success: boolean;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
