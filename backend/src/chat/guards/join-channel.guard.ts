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
import { ChannelDto } from '../dto/channel.dto';

@Injectable()
export class JoinChannelGuard implements CanActivate {
  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    // const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();

    const joinChannelDto = plainToClass(ChannelDto, data);
    const validationErrors = await validate(joinChannelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }
    const channel = await this.channelService.getChanByName(
      joinChannelDto.chanName
    );
    if (channel) {
      if (channel.type !== joinChannelDto.type) {
        throw new ForbiddenException(`This channel is ${channel.type}`);
      } else if (channel.type === 'PRIVATE') {
        throw new ForbiddenException('Private channel: invite only');
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
