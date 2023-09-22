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
import { PrivateMessageDto } from '../dto/private-message.dto';
import { UUID } from '../../utils/types';
import { ChanRestrictService } from '../../database/service/chan-restrict.service';

@Injectable()
export class ChannelMessageGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private chanRestrictService: ChanRestrictService
  ) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const messageDto = plainToClass(PrivateMessageDto, data);
    const validationErrors = await validate(messageDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const { receiverId } = messageDto;
    const channel = await this.channelService.getChanByIdWithMembersAndRestrict(
      receiverId as UUID
    );
    if (channel) {
      const { members, restrictList } = channel;
      const member = members.find((m) => m.id === socket.user.id);
      if (member === undefined) {
        throw new ForbiddenException('User not on channel');
      }
      const restrict = restrictList.find((r) => r.usersId === socket.user.id);
      if (restrict) {
        if (restrict.endOfRestrict > new Date()) {
          throw new ForbiddenException({
            message: 'User restricted',
            endOfRestrict: restrict?.endOfRestrict
          });
        } else {
          this.chanRestrictService.deleteChanRestrictById(restrict.id as UUID);
        }
      }
      return true;
    }
    return false;
  }
}
