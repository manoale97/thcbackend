import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

export enum Roles {
    Admin = 'admin',
    client = 'client',
    employee = 'employee',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true, length: 100 })
    username!: string;

    @Column({ unique: true, length: 100 })
    email!: string;

    @Column({ select: false })
    @Exclude() // Excluye de las respuestas serializadas
    password!: string;

    @Column({ default: 1 })
    status!: number;

    @Column({ nullable: true })
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({ 
            type: 'varchar',
            length: 50,
            default:Roles.client
        })
    role!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            // Argon2 es más seguro y resistente a ataques
            this.password = await argon2.hash(this.password, {
                type: argon2.argon2id, // Recomendado: combinación de seguridad
                memoryCost: 65536,      // 64MB de memoria
                timeCost: 3,            // 3 iteraciones
                parallelism: 1          // 1 hilo
            });
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        try {
            return await argon2.verify(this.password, password);
        } catch (error) {
            return false;
        }
    }
}