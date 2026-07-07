import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../migrations/*.ts'],
    migrationsTableName: 'migrations',
});