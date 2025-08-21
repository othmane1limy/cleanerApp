import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { VerificationService } from './verification.service';
import { DisputeService } from './dispute.service';
import { AuthModule } from '../auth/auth.module';
import { PaymentsModule } from '../payments/payments.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [AuthModule, PaymentsModule, BookingsModule],
  controllers: [AdminController],
  providers: [AdminService, VerificationService, DisputeService],
  exports: [AdminService, VerificationService, DisputeService],
})
export class AdminModule {}
