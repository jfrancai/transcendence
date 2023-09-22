import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword
} from 'class-validator';

const channelTypes = ['PUBLIC', 'PRIVATE', 'PASSWORD'] as const;
export type ChannelType = (typeof channelTypes)[number];

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;

  @IsOptional()
  @IsIn(channelTypes)
  readonly type: ChannelType = 'PRIVATE';

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  readonly password: string;
}
