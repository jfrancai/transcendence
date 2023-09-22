import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
  ForbiddenException
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ChannelService } from '../../database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { JoinChannelDto } from '../dto/join-channel.dto';

@Injectable()
export class DeleteChannelGuard implements CanActivate {
  private readonly logger = new Logger(DeleteChannelGuard.name);

  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    this.logger.debug('DeleteChannelGuard');
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const joinChannelDto = plainToClass(JoinChannelDto, data);
    const validationErrors = await validate(joinChannelDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const { displayName } = joinChannelDto;
    const channel = await this.channelService.getChanByName(displayName);
    if (channel && channel.creatorId === socket.user.id) {
      if (channel.members.length !== 1) {
        throw new ForbiddenException('Channel not empty');
      }
      return true;
    }
    return false;
  }
}
