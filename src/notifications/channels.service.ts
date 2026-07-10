// src/notifications/services/channel-registry.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { ChannelInterface } from './interfaces/channel.interface';
import { ChannelsRepository } from './channels.repository';

import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';
import { PushChannel } from './channels/push.channel';


@Injectable()
export class ChannelsService implements OnModuleInit {
    private readonly logger = new Logger(ChannelsService.name);
    private channels: Map<string, ChannelInterface> = new Map();

    constructor(
        private readonly channelRepository: ChannelsRepository,
        //Inyeccion de canales
        private emailChannel: EmailChannel,
        private smsChannel: SmsChannel,
        private pushChannel: PushChannel,
    ) {}

    async onModuleInit() {
        // Registrar canales en memoria
        this.registerChannel(this.emailChannel);
        this.registerChannel(this.smsChannel);
        this.registerChannel(this.pushChannel);

        // Sincronizar con base de datos
        await this.syncWithDatabase();
    }

    // Registrar un canal manualmente
    private registerChannel(channel: ChannelInterface) {
        this.channels.set(channel.getChannelCode(), channel);
        this.logger.log(`Channel registered: ${channel.getChannelCode()} (${channel.getChannelName()})`);
    }

    // Sincronizar con base de datos
    private async syncWithDatabase() {
        for (const [code, channel] of this.channels) {
            const existing = await this.channelRepository.findOneWithCode(code);
            
            if (!existing) {
                this.channelRepository.create({
                    code: code,
                    name: channel.getChannelName(),
                    isActive: true,
                });
                this.logger.log(`Channel created in DB: ${code}`);
            }
        }
    }

    // Obtener implementación del canal
    getChannel(code: string): ChannelInterface | undefined {
        return this.channels.get(code);
    }

    // Obtener canal de la BD
    async getChannelFromDB(code: string): Promise<Channel | null> {
        return this.channelRepository.findOneWithCode(code);
    }

    // Obtener todos los canales activos
    async getActiveChannels(): Promise<Channel[]> {
        return this.channelRepository.findAll();
    }

    // Activar/Desactivar canal
    async toggleChannel(code: string, isActive: boolean): Promise<Channel> {
        const channel = await this.channelRepository.toggleChannel(code, isActive);
        return channel;
    }
}