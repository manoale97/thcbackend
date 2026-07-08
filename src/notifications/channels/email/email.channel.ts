import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannelInterface, SendNotificationOptions, SendNotificationResult } from '../interfaces/channel.interface';

@Injectable()
export class EmailChannel implements NotificationChannelInterface {
    private readonly logger = new Logger(EmailChannel.name);

    getChannelCode(): string {
        return 'email';
    }

    getChannelName(): string {
        return 'Email';
    }

    validateRecipient(recipient: any): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(recipient?.email || recipient);
    }

    validateContent(content: string, options?: SendNotificationOptions): boolean {
        return content.length > 0 && content.length <= 1000000; // 1MB max
    }

    async send(
        recipient: any,
        content: string,
        options?: SendNotificationOptions
    ): Promise<SendNotificationResult> {
        try {
            this.logger.log(`Sending email to ${recipient.email || recipient}`);
            
            // Simular envío de email (usar nodemailer, SendGrid, AWS SES, etc.)
            // const result = await this.emailService.send({
            //     to: recipient.email || recipient,
            //     subject: options?.variables?.subject || 'Notification',
            //     html: this.formatContent(content, options),
            //     template: options?.template,
            //     ...options,
            // });

            // Simulación
            await new Promise(resolve => setTimeout(resolve, 100));

            return {
                success: true,
                messageId: `email_${Date.now()}`,
                sentAt: new Date(),
                deliveredAt: new Date(),
                metadata: {
                    provider: 'sendgrid',
                    template: options?.template,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    getMaxLength(): number {
        return 1000000; // 1MB
    }

    formatContent(content: string, options?: SendNotificationOptions): string {
        let formatted = content;
        
        if (options?.variables) {
            Object.entries(options.variables).forEach(([key, value]) => {
                formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
            });
        }
        
        return formatted;
    }
}