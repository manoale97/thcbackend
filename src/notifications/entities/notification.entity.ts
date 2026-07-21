import { 
    Entity, 
    Column, 
    Index,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { Channel } from './channel.entity';

export enum NotificationStatus {
    DRAFT = 0,        // Borrador
    PENDING = 1,      // Pendiente de envío
    SENT = 2,         // Enviada
    DELIVERED = 3,    // Entregada
    READ = 4,         // Leída
    FAILED = 5,       // Fallida
    CANCELLED = 6,    // Cancelada
    SCHEDULED = 7,    // Programada
}

export interface NotificationMetadata {
    priority?: 'low' | 'medium' | 'high' | 'critical';
    template?: string;
    variables?: Record<string, any>;
    error?: string;
    retryCount?: number;
    recipient?: {
        name?: string;
        email?: string;
        phone?: string;
        deviceId?: string;
    };
    [key: string]: any;
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 200 })
    title!: string;

    @Column({ type:'text' })
    content!: string;

    @ManyToOne(() => Channel, { eager: true })
    @JoinColumn({ name: 'channelId' })
    channel!: Channel;

    @Column({ 
        type: 'int',
        default:NotificationStatus.PENDING
    })
    status!: number;

    @Column({ type: 'json', nullable: true })
    metadata?: NotificationMetadata;

    @Column({ nullable: true })
    @Index()
    userId?: string;

    @Column({ nullable: true })
    scheduledAt?: Date;

    @Column({ nullable: true })
    sentAt?: Date;

    @Column({ nullable: true })
    deliveredAt?: Date;

    @Column({ nullable: true })
    readAt?: Date;

    @CreateDateColumn()
    @Index()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
