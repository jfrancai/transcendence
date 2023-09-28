import { IntersectionType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ChannelNameDto } from './channel-name.dto';
import { IsArrayUnique } from './class-validator/array-unique.validator';

export class ChannelUsersDto extends IntersectionType(ChannelNameDto) {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  @IsArrayUnique()
  readonly usersID: string[];
}
