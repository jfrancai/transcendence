import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelNameDto {
  @IsNotEmpty()
  @IsString()
  readonly chanName: string;
}
