import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { Notification } from './entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send notification' })
  send(@Param('id') id: string) {
      return this.notificationsService.send(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll() {
      return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
      return this.notificationsService.findOne(id);
  }
}
