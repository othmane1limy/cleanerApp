import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [BookingsModule, PaymentsModule, AdminModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
