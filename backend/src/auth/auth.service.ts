import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { 
  registerClientSchema, 
  registerCleanerSchema, 
  loginSchema, 
  verifyOtpSchema,
  UserRole 
} from '@cleaning-marketplace/shared';
import { generateOTP } from '@cleaning-marketplace/shared';

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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async registerClient(registerData: any): Promise<AuthResponse> {
    const validatedData = registerClientSchema.parse(registerData);
    
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(validatedData.password);

    // Create user and profile in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Enable system role for profile creation
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          role: UserRole.CLIENT,
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

    // Send verification email
    await this.sendVerificationEmail(result.user);

    // Generate tokens
    const tokens = await this.generateTokens(result.user);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role as UserRole,
        emailVerified: result.user.emailVerified,
      },
      profile: result.profile,
      ...tokens,
    };
  }

  async registerCleaner(registerData: any): Promise<AuthResponse> {
    const validatedData = registerCleanerSchema.parse(registerData);
    
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(validatedData.password);

    // Create user and profile in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Enable system role for profile creation
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;

      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          role: UserRole.CLEANER,
        },
      });

      const profile = await tx.cleanerProfile.create({
        data: {
          userId: user.id,
          businessName: validatedData.businessName,
          bio: validatedData.bio,
        },
      });

      // Create initial wallet for cleaner
      await tx.wallet.create({
        data: {
          ownerUserId: user.id,
          balanceMad: 0,
        },
      });

      // Set debt threshold
      await tx.debtThreshold.create({
        data: {
          cleanerUserId: user.id,
          debtLimitMad: this.configService.get('DEBT_LIMIT_MAD', -200),
        },
      });

      return { user, profile };
    });

    // Send verification email
    await this.sendVerificationEmail(result.user);

    // Generate tokens
    const tokens = await this.generateTokens(result.user);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role as UserRole,
        emailVerified: result.user.emailVerified,
      },
      profile: result.profile,
      ...tokens,
    };
  }

  async login(loginData: any): Promise<AuthResponse> {
    const validatedData = loginSchema.parse(loginData);
    
    // Find user with profile
    const user = await this.prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        clientProfile: true,
        cleanerProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, validatedData.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Log audit event
    await this.logAuditEvent(user.id, 'LOGIN', 'user', user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        emailVerified: user.emailVerified,
      },
      profile: user.role === 'CLIENT' ? user.clientProfile : user.cleanerProfile,
      ...tokens,
    };
  }

  async verifyEmail(verificationData: any): Promise<{ success: boolean }> {
    const validatedData = verifyOtpSchema.parse(verificationData);
    
    const user = await this.prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Find valid OTP
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
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Verify OTP
    const isOtpValid = await argon2.verify(otp.codeHash, validatedData.code);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // Update user and consume OTP
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  async refreshToken(refreshToken: string): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as JwtPayload;

      // Find valid session
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
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get updated user data
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<{ success: boolean }> {
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`;
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'CLIENT', true)`;
      
      if (refreshToken) {
        // Revoke specific session
        await tx.session.updateMany({
          where: {
            userId,
            refreshTokenHash: await argon2.hash(refreshToken),
          },
          data: {
            revokedAt: new Date(),
          },
        });
      } else {
        // Revoke all sessions
        await tx.session.updateMany({
          where: { userId },
          data: { revokedAt: new Date() },
        });
      }
    });

    return { success: true };
  }

  private async generateTokens(user: any): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  private async sendVerificationEmail(user: any): Promise<void> {
    const otpCode = generateOTP();
    const codeHash = await argon2.hash(otpCode);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes

    // Store OTP
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
      await tx.emailOTP.create({
        data: {
          userId: user.id,
          codeHash,
          expiresAt,
        },
      });
    });

    // Send email
    await this.emailService.sendVerificationEmail(user.email, otpCode);
  }

  private async logAuditEvent(actorUserId: string, action: string, entity: string, entityId: string, meta?: any): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', 'SYSTEM', true)`;
      
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

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        clientProfile: true,
        cleanerProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Set RLS context for this request
    await this.prisma.enableRLS(user.id, user.role);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profile: user.role === 'CLIENT' ? user.clientProfile : user.cleanerProfile,
    };
  }
}
