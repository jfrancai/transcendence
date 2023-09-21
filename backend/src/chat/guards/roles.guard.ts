import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { validate } from 'class-validator';
import { ChannelService } from 'src/database/service/channel.service';
import { Roles } from '../decorators/roles.decorator';
import { ChatSocket } from '../chat.interface';
import { JoinChannelDto } from '../dto/JoinChannel.dto';

@Injectable()
export class JoinChannelGuard implements CanActivate {
  private readonly logger = new Logger(JoinChannelGuard.name);

  constructor(
    private channelService: ChannelService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const socket = context.switchToWs().getClient() as ChatSocket;
    const data = context.switchToWs().getData();
    const dataInstance = plainToClass(JoinChannelDto, data);
    const validationErrors = await validate(dataInstance);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    //const channel = this.channelService.getChannel();
    return false;
  }
}
