import { IntersectionType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ChannelIdDto } from './channel-id.dto';

export class ChannelRestrictDto extends IntersectionType(ChannelIdDto) {
  @IsNotEmpty()
  @IsUUID('4')
  readonly userID: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['BAN', 'MUTE', 'KICK', 'UNBAN'])
  readonly restrictType: 'BAN' | 'MUTE' | 'KICK' | 'UNBAN';

  @IsNotEmpty()
  @IsString()
  readonly reason: string;
}
