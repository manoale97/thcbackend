import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsDate, IsEnum, IsNumber, IsNotEmpty, IsUUID} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationChannel, NotificationStatus, NotificationMetadata } from '../entities/notification.entity';

export class CreateNotificationDto {
    @ApiProperty({
        description: 'Notification title',
        example: 'Welcome to our platform!',
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title must be at least 3 characters' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title!: string;

    @ApiProperty({
        description: 'Notification content',
        example: 'Thank you for joining our platform. We are excited to have you!',
    })
    @IsString()
    @IsNotEmpty({ message: 'Content is required' })
    @MinLength(10, { message: 'Content must be at least 10 characters' })
    content!: string;

    @ApiProperty({
        description: 'Notification channel',
        enum: NotificationChannel,
        example: NotificationChannel.EMAIL,
        default: NotificationChannel.EMAIL,
    })
    @IsEnum(NotificationChannel, {
        message: 'Channel must be one of: EMAIL, SMS, PUSH',
    })
    @IsNotEmpty({ message: 'Channel is required' })
    channel?: NotificationChannel;

    @ApiProperty({
        description: 'Notification status',
        enum: NotificationStatus,
        example: NotificationStatus.PENDING,
        default: NotificationStatus.PENDING,
        required: false,
    })
    @IsEnum(NotificationStatus, {
        message: 'Status must be: DRAFT(0), PENDING(1), SENT(2), DELIVERED(3), READ(4), FAILED(5), CANCELLED(6), SCHEDULED(7)',
    })
    @IsOptional()
    status?: NotificationStatus;

    @ApiProperty({
        description: 'User ID receiving the notification',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsOptional()
    userId?: string;

    @ApiProperty({
        description: 'Scheduled date for the notification',
        example: '2024-12-25T10:00:00Z',
        required: false,
    })
    @IsDate({ message: 'Scheduled date must be a valid date' })
    @Type(() => Date)
    @IsOptional()
    scheduledAt?: Date;
}
