import { IntersectionType } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf
} from 'class-validator';
import { ChannelIdDto } from './channel-id.dto';

export class ChannelRestrictDto extends IntersectionType(ChannelIdDto) {
  @IsNotEmpty()
  @IsUUID('4')
  readonly userID: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['BAN', 'MUTE', 'KICK', 'UNBAN'])
  readonly restrictType: 'BAN' | 'MUTE' | 'KICK' | 'UNBAN';

  @ValidateIf((obj, val) => !val && obj.type === 'MUTE')
  @IsNumber()
  @IsPositive()
  readonly muteTime: number | undefined;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;
}
