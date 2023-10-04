import { Reflector } from '@nestjs/core';
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
import { ChannelNameDto } from '../dto/channel-name.dto';
import { EmptyChannel } from '../decorators/empty-channel';

@Injectable()
export class EmptyChannelGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const notEmpty = this.reflector.get(EmptyChannel, context.getHandler());
    if (!notEmpty) {
      return true;
    }
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(ChannelNameDto, data);
    const validationErrors = await validate(channelDto);
    const message = validationErrors.map((e) => e.constraints);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ message });
    }
    const { chanID } = channelDto;
    const channel = await this.channelService.getChanByIdWithMembers(chanID);
    if (channel) {
      if (channel.members.length !== 1) {
        throw new ForbiddenException('Channel not empty');
      }
      return true;
    }
    return false;
  }
}
