import { IntersectionType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

export class JoinChannelDto extends IntersectionType(ChannelDto, PasswordDto) {}
