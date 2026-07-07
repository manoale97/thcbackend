import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { AppDataSource } from 'src/config/database.config';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NotificationsRepository {
  private notifications = AppDataSource.getRepository(Notification);

  async findAll(): Promise<Notification[]> {
    return await this.notifications.find();
  }

  async findOne(id: string): Promise<Notification> {
    const user = await this.notifications.findOne({where: {id}});
    if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    return user
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el usuario ya existe
        const existingUser = await this.users.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username }
            ]
        });

        if(existingUser){
          throw new ConflictException('User already exists')
        }

        const user = this.users.create(createUserDto);
        return await this.users.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.users.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.users.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`User with ID ${id} not found`);
      }
  }
}