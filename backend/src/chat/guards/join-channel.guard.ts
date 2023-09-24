import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { ChannelService } from '../../database/service/channel.service';
import { ChatSocket } from '../chat.interface';
import { ChanInviteService } from '../../database/service/chan-invite.service';
import { ChannelDto } from '../dto/channel.dto';

@Injectable()
export class JoinChannelGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private chanInviteService: ChanInviteService
  ) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const joinChannelDto = plainToClass(ChannelDto, data);
    const validationErrors = await validate(joinChannelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }
    const channel = await this.channelService.getDeepChanByName(
      joinChannelDto.chanName
    );
    if (channel) {
      const { inviteList } = channel;

      if (channel.members.find((m) => m.id === socket.user.id!)) {
        throw new ForbiddenException('User already in channel');
      }
      if (channel!.type === 'PRIVATE') {
        const invite = inviteList.find((i) => i.usersId === socket.user.id);
        if (invite === undefined) {
          throw new ForbiddenException('Private channel: invite only');
        }
        await this.chanInviteService.deleteChanInviteById(invite.id);
      } else if (channel.type === 'PASSWORD') {
        const result = await bcrypt.compare(
          joinChannelDto.password!,
          channel.password!
        );
        if (result === false) {
          throw new ForbiddenException('Wrong password');
        }
      }
      return true;
    }
    return false;
  }
}
