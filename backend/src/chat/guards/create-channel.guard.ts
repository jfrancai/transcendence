import { plainToClass } from 'class-transformer';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Injectable()
export class CreateChannelGuard implements CanActivate {
  private readonly logger = new Logger(CreateChannelGuard.name);

  async canActivate(context: ExecutionContext) {
    this.logger.debug('CreateChannelGuard');
    const data = context.switchToWs().getData();

    const channelDto = plainToClass(CreateChannelDto, data);
    const validationErrors = await validate(channelDto);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    const { type, password } = channelDto;
    if (type === 'PASSWORD') {
      if (password === undefined) {
        throw new BadRequestException('Password is missing');
      }
    }
    return true;
  }
}
