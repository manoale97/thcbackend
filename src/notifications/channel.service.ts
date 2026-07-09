// src/notifications/services/channel-registry.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelInterface } from './interfaces/channel.interface';

// 👇 Importar todos los canales manualmente
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';
import { PushChannel } from './channels/push.channel';

@Injectable()
export class ChannelService implements OnModuleInit {
    private readonly logger = new Logger(ChannelService.name);
    private channels: Map<string, ChannelInterface> = new Map();

    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
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
            const existing = await this.channelRepository.findOne({ where: { code } });
            
            if (!existing) {
                const newChannel = this.channelRepository.create({
                    code: code,
                    name: channel.getChannelName(),
                    isActive: true,
                });
                await this.channelRepository.save(newChannel);
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
        return this.channelRepository.findOne({ where: { code, isActive: true } });
    }

    // Obtener todos los canales activos
    async getActiveChannels(): Promise<Channel[]> {
        return this.channelRepository.find({ where: { isActive: true } });
    }

    // Registrar canal dinámicamente vía controlador
    async registerNewChannel(
        code: string,
        name: string,
        channelImplementation: ChannelInterface
    ): Promise<Channel> {
        // Verificar si ya existe
        if (this.channels.has(code)) {
            throw new Error(`Channel '${code}' already exists`);
        }

        // Registrar en memoria
        this.registerChannel(channelImplementation);

        // Guardar en base de datos
        const newChannel = this.channelRepository.create({
            code,
            name,
            isActive: true,
        });
        const saved = await this.channelRepository.save(newChannel);
        
        this.logger.log(`New channel registered dynamically: ${code} (${name})`);
        return saved;
    }

    // Activar/Desactivar canal
    async toggleChannel(code: string, isActive: boolean): Promise<Channel> {
        const channel = await this.channelRepository.findOne({ where: { code } });
        if (!channel) {
            throw new Error(`Channel '${code}' not found`);
        }
        
        channel.isActive = isActive;
        return this.channelRepository.save(channel);
    }
}