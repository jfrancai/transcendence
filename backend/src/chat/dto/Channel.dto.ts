import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const channelTypes = ['PUBLIC', 'PRIVATE', 'PASSWORD'] as const;
export type ChannelType = (typeof channelTypes)[number];

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;

  @IsIn(channelTypes)
  readonly type: ChannelType;
}
