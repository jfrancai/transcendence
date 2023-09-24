import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException
} from '@nestjs/common';
import { ChannelService } from '../../database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { Roles } from '../decorators/roles.decorator';
import { ChannelDto } from '../dto/channel.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(ChannelDto, data);
    const validationErrors = await validate(channelDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    const { chanName } = channelDto;
    const channel = await this.channelService.getChanByName(chanName);
    if (channel) {
      let socketRole: 'creator' | 'admin' | 'member';
      if (channel.creatorId === socket.user.id) {
        socketRole = 'creator';
      } else if (channel.admins.includes(socket.user.id!)) {
        socketRole = 'admin';
      } else {
        socketRole = 'member';
      }
      return roles.includes(socketRole);
    }
    return false;
  }
}
