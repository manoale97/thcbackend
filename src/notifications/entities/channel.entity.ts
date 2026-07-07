import { 
    Entity, 
    Column, 
    Index,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Notification } from './notification.entity';

@Entity('channels')
@Index(['code'], { unique: true })
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true, length: 50 })
    @Index()
    code!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany(() => Notification, notification => notification.channel)
    notifications?: Notification[];
}
