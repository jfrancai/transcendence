import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword
} from 'class-validator';

const channelTypes = ['PUBLIC', 'PRIVATE', 'PASSWORD'] as const;
export type CreateChannelType = (typeof channelTypes)[number];

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;

  @IsOptional()
  @IsIn(channelTypes)
  readonly type: CreateChannelType = 'PRIVATE';

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  readonly password: string | undefined;
}
