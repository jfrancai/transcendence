import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ChannelService } from '../../database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { ChannelMessageDto } from '../dto/channel-message.dto';

@Injectable()
export class ChannelMessageGuard implements CanActivate {
  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const messageDto = plainToClass(ChannelMessageDto, data);
    const validationErrors = await validate(messageDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const { chanName } = messageDto;
    const channel = await this.channelService.getChanWithMembers(chanName);
    if (channel) {
      const { members } = channel;
      const member = members.find((m) => m.id === socket.user.id);
      if (member === undefined) {
        throw new ForbiddenException('User not on channel');
      }
      return true;
    }
    return false;
  }
}
