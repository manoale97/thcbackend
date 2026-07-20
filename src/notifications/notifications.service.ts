import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { NotificationsRepository } from './notifications.repository';
import { ChannelsService } from './channels.service';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
          private readonly notificationsRepository: NotificationsRepository,
          private readonly channelsService: ChannelsService
      ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification>  {
    //validar canal
    const channel = await this.channelsService.getChannelFromDB(createDto.channelCode);
        if (!channel) {
            throw new BadRequestException(`Channel '${createDto.channelCode}' not available`);
        }

    //validar contenido
    const channelImpl = this.channelsService.getChannel(createDto.channelCode);
        if (!channelImpl) {
            throw new BadRequestException(`Channel implementation not found`);
        }

        if (!channelImpl.validateContent(createDto.content)) {
            throw new BadRequestException(`Invalid content or recipient for channel ${createDto.channelCode}`);
        }

    //crear notificacion
    const notification = await this.notificationsRepository.create(createDto)

    return notification;
  }

  async send(id: string): Promise<Notification> {
      const notification = await this.notificationsRepository.findOne(id);

      if (!notification) {
          throw new NotFoundException(`Notification ${id} not found`);
      }

      // Obtener implementación del canal
      const channelImpl = this.channelsService.getChannel(notification.channel.code);
      if (!channelImpl) {
          throw new BadRequestException(`Channel '${notification.channel.code}' not available`);
      }

      // Enviar
      const recipient = notification.metadata?.recipient || {};
      const result = await channelImpl.send(
          recipient,
          notification.content,
          notification.metadata
      );

      // Actualizar estado
      if (result.success) {
          notification.status = NotificationStatus.SENT;
          notification.sentAt = result.sentAt || new Date();
          notification.metadata = {
              ...notification.metadata,
              messageId: result.messageId,
              sentMetadata: result.metadata,
          };
      } else {
          notification.status = NotificationStatus.FAILED;
          notification.metadata = {
              ...notification.metadata,
              error: result.error,
          };
      }

      return await this.notificationsRepository.update(id,notification)
  }

  async findAll(): Promise<Notification[]> {
    const notifications = this.notificationsRepository.findAll()
    return notifications;
  }

  async findOne(id: string): Promise<Notification> {
    const notificacion = this.notificationsRepository.findOne(id)
    return notificacion;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<string> {
    this.notificationsRepository.update(id, updateNotificationDto)
    return `The notification #${id} has been updated`;
  }

  async remove(id: string): Promise<void> {
    this.notificationsRepository.remove(id);
  }
}
