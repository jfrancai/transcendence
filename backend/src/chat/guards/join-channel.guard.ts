import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
  ForbiddenException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { ChannelService } from 'src/database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { JoinChannelDto } from '../dto/JoinChannel.dto';
import { UUID } from '../../utils/types';
import { CONST_SALT } from '../../auth/constants';

@Injectable()
export class JoinChannelGuard implements CanActivate {
  private readonly logger = new Logger(JoinChannelGuard.name);

  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    this.logger.debug('JoinChannelGuard');
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const joinChannelDto = plainToClass(JoinChannelDto, data);
    const validationErrors = await validate(joinChannelDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const channel = await this.channelService.getChanByName(
      joinChannelDto.displayName as UUID
    );
    if (channel!.members.includes(socket.user.id!)) {
      throw new ForbiddenException('User already in channel');
    }
    if (channel!.banList.includes(socket.user.id!)) {
      throw new ForbiddenException('Banned from channel');
    }
    if (channel!.type === 'PRIVATE') {
      if (channel!.inviteList.includes(socket.user.id!) === false) {
        throw new ForbiddenException('Private channel: invite only');
      }
      const updatedInviteList = channel?.inviteList.filter(
        (invite) => invite !== socket.user.id
      );
      this.channelService.updateInviteList(
        channel!.id as UUID,
        updatedInviteList! as UUID[]
      );
      this.channelService.updateMembers(channel!.id as UUID, socket.user.id!);
    } else if (channel!.type === 'PASSWORD') {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const passwordHash = await bcrypt.hash(joinChannelDto.password, salt);
      if (passwordHash !== channel?.password) {
        throw new ForbiddenException('Wrong password');
      }
    }
    return true;
  }
}
