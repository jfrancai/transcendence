import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateIf
} from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly chanName: string;

  @IsEnum($Enums.ChannelType)
  readonly type: $Enums.ChannelType;

  @ValidateIf((obj, val) => !val && obj.type === 'PASSWORD')
  @IsString()
  @IsStrongPassword()
  readonly password: string | undefined;
}
