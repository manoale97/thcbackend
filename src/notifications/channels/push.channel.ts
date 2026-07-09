import { Injectable, Logger } from '@nestjs/common';
import { ChannelInterface, SendNotificationOptions, SendNotificationResult } from '../interfaces/channel.interface';

@Injectable()
export class PushChannel implements ChannelInterface {
    private readonly logger = new Logger(PushChannel.name);

    getChannelCode(): string {
        return 'push';
    }

    getChannelName(): string {
        return 'Push Notification';
    }

    validateRecipient(recipient: any): boolean {
        return !!(recipient?.deviceId || recipient?.deviceToken);
    }

    validateContent(content: string, options?: SendNotificationOptions): boolean {
        return content.length > 0 && content.length <= 1000;
    }

    async send(
        recipient: any,
        content: string,
        options?: SendNotificationOptions
    ): Promise<SendNotificationResult> {
        try {
            this.logger.log(`Sending push notification to ${recipient.deviceId || 'unknown'}`);
            
            // Simular envío de Push
            await new Promise(resolve => setTimeout(resolve, 80));

            return {
                success: true,
                messageId: `push_${Date.now()}`,
                sentAt: new Date(),
            };
        } catch (error:any) {
            this.logger.error(`Failed to send push notification: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    getMaxLength(): number {
        return 1000;
    }

    formatContent(content: string, options?: SendNotificationOptions): string {
        return content;
    }
}