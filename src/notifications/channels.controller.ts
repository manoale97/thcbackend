import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { ToggleChannelDto } from './dto/toggleChannel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('channels')
@ApiBearerAuth('access-token')
@Controller('channels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active channels' })
  @ApiResponse({ status: 200, description: 'Active channels list' })
  async findAll() {
    return this.channelsService.getActiveChannels();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get channel by code' })
  async findOne(@Param('code') code: string) {
    return this.channelsService.getChannelFromDB(code);
  }

  @Patch(':code/toggle')
  @Roles('admin')
  @ApiOperation({ summary: 'Activate or deactivate a channel (admin only)' })
  async toggle(@Param('code') code: string, @Body() body: ToggleChannelDto) {
    return this.channelsService.toggleChannel(code, body.isActive);
  }
}
