import { IntersectionType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsString,
  IsStrongPassword,
  ValidateIf
} from 'class-validator';
import { ChannelNameDto } from './channel-name.dto';

export class ChannelJoinDto extends IntersectionType(ChannelNameDto) {
  @IsEnum($Enums.ChannelType)
  readonly type: $Enums.ChannelType;

  @ValidateIf((obj, val) => !val && obj.type === 'PASSWORD')
  @IsString()
  @IsStrongPassword()
  readonly password: string | undefined;
}
