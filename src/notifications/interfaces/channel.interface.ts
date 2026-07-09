export interface SendNotificationOptions {
    template?:string,
    variables?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SendNotificationResult {
    success: boolean;
    messageId?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    error?: string;
    metadata?: Record<string, any>;
}

export interface ChannelInterface {
    // Identificación del canal
    getChannelCode(): string;
    getChannelName(): string;
    
    // Validación
    validateRecipient(recipient: any): boolean;
    validateContent(content: string, options?: SendNotificationOptions): boolean;
    
    // Envío
    send(
        recipient: any,
        content: string,
        options?: SendNotificationOptions
    ): Promise<SendNotificationResult>;
    
    // Configuración
    getMaxLength(): number;
    
    // Formateo
    formatContent(content: string, options?: SendNotificationOptions): string;
}