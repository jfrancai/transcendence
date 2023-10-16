import { IntersectionType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

const channelTypes = ['PUBLIC', 'PRIVATE', 'PASSWORD'] as const;
export type CreateChannelType = (typeof channelTypes)[number];

export class CreateChannelDto extends IntersectionType(ChannelDto) {
  readonly img: string;
}
