import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from './entities/user.entity';
import { responseUserDto } from './dto/responseUser.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'List of users', type: [responseUserDto] })
  async findAll(): Promise<responseUserDto[]> {
      return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  async findOne(@Param('id') id: string): Promise<responseUserDto> {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @Roles('admin', 'employee')
  async create(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return await this.usersService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @Roles('admin', 'employee')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<UpdateUserDto> {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    this.usersService.remove(id);
    return { deleted: true };
  }
}
