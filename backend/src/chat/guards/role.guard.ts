import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { ChannelService } from '../../database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { Roles, RolesType } from '../decorators/roles.decorator';
import { ChannelNameDto } from '../dto/channel-name.dto';

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

    const channelDto = plainToClass(ChannelNameDto, data);
    const validationErrors = await validate(channelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }

    const { chanID } = channelDto;
    const channel = await this.channelService.getChanByIdWithMembers(chanID);
    if (channel) {
      let socketRole: RolesType;
      if (channel.creatorID === socket.user.id) {
        socketRole = 'creator';
      } else if (channel.admins.includes(socket.user.id!)) {
        socketRole = 'admin';
      } else if (channel.members.find((m) => m.id === socket.user.id)) {
        socketRole = 'member';
      } else {
        socketRole = 'stranger';
      }
      const isActivate = roles.includes(socketRole);
      if (isActivate === false) {
        throw new ForbiddenException({
          message: 'Unauthorized role',
          authorizedRoles: roles
        });
      }
      return true;
    }
    return false;
  }
}
