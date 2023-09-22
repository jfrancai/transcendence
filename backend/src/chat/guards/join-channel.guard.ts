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
import { ChanRestrictService } from '../../database/service/chan-restrict.service';
import { ChanInviteService } from '../../database/service/chan-invite.service';

@Injectable()
export class JoinChannelGuard implements CanActivate {
  private readonly logger = new Logger(JoinChannelGuard.name);

  constructor(
    private channelService: ChannelService,
    private chanInviteService: ChanInviteService,
    private chanRestrictService: ChanRestrictService
  ) {}

  async canActivate(context: ExecutionContext) {
    this.logger.debug('JoinChannelGuard');
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const joinChannelDto = plainToClass(JoinChannelDto, data);
    const validationErrors = await validate(joinChannelDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const channel = await this.channelService.getDeepChanByName(
      joinChannelDto.displayName as UUID
    );
    if (channel) {
      const { inviteList, restrictList } = channel;

      if (channel.members.includes(socket.user.id!)) {
        throw new ForbiddenException('User already in channel');
      }
      const restrict = restrictList.find((r) => r.usersId === socket.user.id!);

      if (restrict && restrict.endOfRestrict < new Date()) {
        this.chanRestrictService.deleteChanRestrictById(restrict.id as UUID);
      }
      if (restrict && restrict.type === 'BAN') {
        throw new ForbiddenException(
          `Banned from channel until ${restrict.endOfRestrict}`
        );
      }
      if (channel!.type === 'PRIVATE') {
        const invite = inviteList.find((i) => i.usersId === socket.user.id);
        if (invite === undefined) {
          throw new ForbiddenException('Private channel: invite only');
        }
        await this.chanInviteService.deleteChanInviteById(invite.id as UUID);
      } else if (channel.type === 'PASSWORD') {
        const result = await bcrypt.compare(
          joinChannelDto.password,
          channel.password!
        );
        if (result === false) {
          throw new ForbiddenException('Wrong password');
        }
      }
    }
    return true;
  }
}
