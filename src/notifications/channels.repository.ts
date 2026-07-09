import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/config/database.config';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';

@Injectable()
export class ChannelsRepository {
  private channels = AppDataSource.getRepository(Channel);

  async findAll(): Promise<Channel[]> {
    return await this.channels.find();
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await this.channels.findOne({where: {id}});
    if (!channel) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    return channel
  }

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
        const channel = this.channels.create(createChannelDto);
        return await this.channels.save(channel);
  }

  async remove(id: string): Promise<void> {
    const result = await this.channels.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`User with ID ${id} not found`);
      }
  }
}
