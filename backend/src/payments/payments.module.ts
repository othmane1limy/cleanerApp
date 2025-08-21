import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WalletService } from './wallet.service';
import { PaypalService } from './paypal.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, WalletService, PaypalService],
  exports: [PaymentsService, WalletService],
})
export class PaymentsModule {}
