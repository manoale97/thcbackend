import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { ChannelsService } from './channels.service';
import { ChannelsRepository } from './channels.repository';
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';
import { PushChannel } from './channels/push.channel';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    ChannelsService,
    ChannelsRepository,
    EmailChannel,
    SmsChannel,
    PushChannel,
  ],
  exports: [NotificationsService, ChannelsService],
})
export class NotificationsModule {}
