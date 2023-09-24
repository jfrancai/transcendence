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
import { LeaveChannelDto } from '../dto/leave-channel.dto';

@Injectable()
export class LeaveChannelGuard implements CanActivate {
  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const leaveChannelDto = plainToClass(LeaveChannelDto, data);
    const validationErrors = await validate(leaveChannelDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const channel = await this.channelService.getChanWithMembers(
      leaveChannelDto.chanName
    );
    if (channel) {
      if (channel.creatorId === socket.user.id) {
        throw new ForbiddenException("Creator of a channel can't leaves it");
      }
      return true;
    }
    return false;
  }
}
