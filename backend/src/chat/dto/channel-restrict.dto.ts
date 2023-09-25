import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ChannelNameDto } from './channel-name.dto';

export class ChannelRestrictDto extends IntersectionType(ChannelNameDto) {
  @IsNotEmpty()
  @IsUUID('4')
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['BAN', 'MUTE', 'KICK'])
  readonly restrictType: 'BAN' | 'MUTE' | 'KICK';

  @IsNotEmpty()
  @IsDate()
  readonly endOfRestrict: Date;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;
}
