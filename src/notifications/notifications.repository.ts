import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { AppDataSource } from 'src/config/database.config';
import { NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';

@Injectable()
export class NotificationsRepository {
  private notifications = AppDataSource.getRepository(Notification);

  async findAll(): Promise<Notification[]> {
    return await this.notifications.find();
  }

  async findOne(id: string): Promise<Notification> {
    const user = await this.notifications.findOne({where: {id}});
    if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    return user
  }

  async create(data: CreateNotificationDto): Promise<Notification> {
    const notification = this.notifications.create(data);
    return await this.notifications.save(notification);
  }

  async update(id: string, UpdateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, UpdateNotificationDto);
    return await this.notifications.save(notification);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notifications.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`User with ID ${id} not found`);
      }
  }
}