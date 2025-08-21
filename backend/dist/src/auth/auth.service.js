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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon2 = require("argon2");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
const shared_1 = require("@cleaning-marketplace/shared");
const shared_2 = require("@cleaning-marketplace/shared");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    emailService;
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async registerClient(registerData) {
        const validatedData = shared_1.registerClientSchema.parse(registerData);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const passwordHash = await argon2.hash(validatedData.password);
        const result = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    passwordHash,
                    role: shared_1.UserRole.CLIENT,
                    phone: validatedData.phone,
                },
            });
            const profile = await tx.clientProfile.create({
                data: {
                    userId: user.id,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                },
            });
            return { user, profile };
        });
        await this.sendVerificationEmail(result.user);
        const tokens = await this.generateTokens(result.user);
        return {
            user: {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                emailVerified: result.user.emailVerified,
            },
            profile: result.profile,
            ...tokens,
        };
    }
    async registerCleaner(registerData) {
        const validatedData = shared_1.registerCleanerSchema.parse(registerData);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const passwordHash = await argon2.hash(validatedData.password);
        const result = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    passwordHash,
                    role: shared_1.UserRole.CLEANER,
                },
            });
            const profile = await tx.cleanerProfile.create({
                data: {
                    userId: user.id,
                    businessName: validatedData.businessName,
                    bio: validatedData.bio,
                },
            });
            await tx.wallet.create({
                data: {
                    ownerUserId: user.id,
                    balanceMad: 0,
                },
            });
            await tx.debtThreshold.create({
                data: {
                    cleanerUserId: user.id,
                    debtLimitMad: this.configService.get('DEBT_LIMIT_MAD', -200),
                },
            });
            return { user, profile };
        });
        await this.sendVerificationEmail(result.user);
        const tokens = await this.generateTokens(result.user);
        return {
            user: {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                emailVerified: result.user.emailVerified,
            },
            profile: result.profile,
            ...tokens,
        };
    }
    async login(loginData) {
        const validatedData = shared_1.loginSchema.parse(loginData);
        const user = await this.prisma.user.findUnique({
            where: { email: validatedData.email },
            include: {
                clientProfile: true,
                cleanerProfile: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, validatedData.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user);
        await this.logAuditEvent(user.id, 'LOGIN', 'user', user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
            profile: user.role === 'CLIENT' ? user.clientProfile : user.cleanerProfile,
            ...tokens,
        };
    }
    async verifyEmail(verificationData) {
        const validatedData = shared_1.verifyOtpSchema.parse(verificationData);
        const user = await this.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const otp = await this.prisma.emailOTP.findFirst({
            where: {
                userId: user.id,
                consumedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const isOtpValid = await argon2.verify(otp.codeHash, validatedData.code);
        if (!isOtpValid) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.user.update({
                where: { id: user.id },
                data: { emailVerified: true },
            });
            await tx.emailOTP.update({
                where: { id: otp.id },
                data: { consumedAt: new Date() },
            });
        });
        return { success: true };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const session = await this.prisma.session.findFirst({
                where: {
                    userId: payload.sub,
                    refreshTokenHash: await argon2.hash(refreshToken),
                    expiresAt: {
                        gt: new Date(),
                    },
                    revokedAt: null,
                },
            });
            if (!session) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, refreshToken) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_id', ${userId}, true)`;
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'CLIENT', true)`;
            if (refreshToken) {
                await tx.session.updateMany({
                    where: {
                        userId,
                        refreshTokenHash: await argon2.hash(refreshToken),
                    },
                    data: {
                        revokedAt: new Date(),
                    },
                });
            }
            else {
                await tx.session.updateMany({
                    where: { userId },
                    data: { revokedAt: new Date() },
                });
            }
        });
        return { success: true };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash: await argon2.hash(refreshToken),
                    expiresAt,
                },
            });
        });
        return { accessToken, refreshToken };
    }
    async sendVerificationEmail(user) {
        const otpCode = (0, shared_2.generateOTP)();
        const codeHash = await argon2.hash(otpCode);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.emailOTP.create({
                data: {
                    userId: user.id,
                    codeHash,
                    expiresAt,
                },
            });
        });
        await this.emailService.sendVerificationEmail(user.email, otpCode);
    }
    async logAuditEvent(actorUserId, action, entity, entityId, meta) {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
            await tx.auditLog.create({
                data: {
                    actorUserId,
                    action,
                    entity,
                    entityId,
                    meta,
                },
            });
        });
    }
    async validateUser(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                clientProfile: true,
                cleanerProfile: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.prisma.enableRLS(user.id, user.role);
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            profile: user.role === 'CLIENT' ? user.clientProfile : user.cleanerProfile,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map