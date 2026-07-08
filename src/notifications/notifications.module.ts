import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from './channels/email/email.module';
import { SmsModule } from './channels/sms/sms.module';
import { PushModule } from './channels/push/push.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [EmailModule, SmsModule, PushModule],
})
export class NotificationsModule {}
