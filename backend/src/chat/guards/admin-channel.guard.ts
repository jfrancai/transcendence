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
import { AdminChannelDto } from '../dto/admin-channel.dto';

@Injectable()
export class AddAdminChannelGuard implements CanActivate {
  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const adminChannelDto = plainToClass(AdminChannelDto, data);

    const validationErrors = await validate(adminChannelDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    const { chanName, userId } = adminChannelDto;

    const channel = await this.channelService.getChanByName(chanName);
    if (channel) {
      if (channel.admins.includes(socket.user.id!) === undefined) {
        throw new ForbiddenException(
          'Admin request must be done by admin user'
        );
      }
      if (channel.admins.includes(userId)) {
        throw new ForbiddenException('User already admin of this channel');
      }
      return true;
    }
    return false;
  }
}
