import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { ChannelService } from '../../database/service/channel.service';
import { ChanRestrictService } from '../../database/service/chan-restrict.service';
import { ChatSocket } from '../chat.interface';
import { ChannelDto } from '../dto/channel.dto';
import { Restrict } from '../decorators/restricts.decorator';

@Injectable()
export class RestrictGuard implements CanActivate {
  private readonly logger = new Logger(RestrictGuard.name);

  constructor(
    private channelService: ChannelService,
    private chanRestrictService: ChanRestrictService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const restricts = this.reflector.get(Restrict, context.getHandler());
    if (!restricts) {
      return true;
    }

    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(ChannelDto, data);
    const validationErrors = await validate(channelDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    const { chanName } = channelDto;
    const channel = await this.channelService.getChanWithRestrictList(chanName);
    if (channel) {
      const restrictSet: Set<'banned' | 'muted'> = new Set();
      const { restrictList } = channel;
      const userRestricts = restrictList.filter(
        (r) => r.usersId === socket.user.id!
      );
      userRestricts.forEach((restrict) => {
        if (restrict.endOfRestrict < new Date()) {
          this.chanRestrictService.deleteChanRestrictById(restrict.id);
        } else if (restrict.type === 'BAN') {
          restrictSet.add('banned');
        } else if (restrict.type === 'MUTE') {
          restrictSet.add('muted');
        }
      });
      const restrictArr = Array.from(restrictSet);
      this.logger.debug(restrictArr, restricts);
      return !restricts.some((r) => restrictArr.includes(r));
    }
    return false;
  }
}
