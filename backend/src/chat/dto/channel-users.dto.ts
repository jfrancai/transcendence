import { IntersectionType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { IsArrayUnique } from './class-validator/array-unique.validator';
import { ChannelIdDto } from './channel-id.dto';

export class ChannelUsersDto extends IntersectionType(ChannelIdDto) {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  @IsArrayUnique()
  readonly usersID: string[];
}
