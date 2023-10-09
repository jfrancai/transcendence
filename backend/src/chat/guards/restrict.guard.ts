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
import { Restrict } from '../decorators/restricts.decorator';
import { ChannelIdDto } from '../dto/channel-id.dto';

@Injectable()
export class RestrictGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const restricts = this.reflector.get(Restrict, context.getHandler());
    if (!restricts) {
      return true;
    }
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(ChannelIdDto, data);
    const validationErrors = await validate(channelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }

    const { chanID } = channelDto;
    const channel = await this.channelService.getChanById(chanID);
    if (channel) {
      const isMute = channel.mute.includes(socket.user.id!);
      if (restricts.includes('muted') && isMute) {
        return false;
      }
      const isBan = channel.bans.includes(socket.user.id!);
      if (restricts.includes('banned') && isBan) {
        return false;
      }
      return true;
    }
    return false;
  }
}
