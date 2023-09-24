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
import { ChannelDto } from '../dto/channel.dto';

@Injectable()
export class EmptyChannelGuard implements CanActivate {
  constructor(private channelService: ChannelService) {}

  async canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(ChannelDto, data);
    const validationErrors = await validate(channelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }
    const { chanName } = channelDto;
    const channel = await this.channelService.getChanWithMembers(chanName);
    if (channel) {
      if (channel.members.length !== 1) {
        throw new ForbiddenException('Channel not empty');
      }
      return true;
    }
    return false;
  }
}
