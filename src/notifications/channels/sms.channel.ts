import { Injectable, Logger } from '@nestjs/common';
import { ChannelInterface, SendNotificationOptions, SendNotificationResult } from '../interfaces/channel.interface';

@Injectable()
export class SmsChannel implements ChannelInterface {
    private readonly logger = new Logger(SmsChannel.name);

    getChannelCode(): string {
        return 'sms';
    }

    getChannelName(): string {
        return 'SMS';
    }

    validateRecipient(recipient: any): boolean {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
        return phoneRegex.test(recipient?.phone || recipient);
    }

    validateContent(content: string, options?: SendNotificationOptions): boolean {
        return content.length > 0 && content.length <= 160; // SMS standard
    }

    async send(
        recipient: any,
        content: string,
        options?: SendNotificationOptions
    ): Promise<SendNotificationResult> {
        try {
            this.logger.log(`Sending SMS to ${recipient.phone || recipient}`);
            
            // Simular envío de SMS
            await new Promise(resolve => setTimeout(resolve, 50));

            return {
                success: true,
                messageId: `sms_${Date.now()}`,
                sentAt: new Date(),
                deliveredAt: new Date(),
            };
        } catch (error:any) {
            this.logger.error(`Failed to send SMS: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    getMaxLength(): number {
        return 160;
    }

    formatContent(content: string, options?: SendNotificationOptions): string {
        return content; // SMS no soporta variables complejas
    }
}