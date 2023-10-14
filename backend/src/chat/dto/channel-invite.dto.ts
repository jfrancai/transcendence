import { IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ChannelIdDto } from './channel-id.dto';

export class ChannelInviteDto extends IntersectionType(ChannelIdDto) {
  @IsNotEmpty()
  @IsUUID('4')
  readonly userID: string;
}
