import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/config/database.config';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersRepository {
  private users = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.users.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.users.findOne({where: {id}});
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
