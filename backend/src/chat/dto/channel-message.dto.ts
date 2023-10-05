import { IsNotEmpty, IsString } from 'class-validator';
import { ChannelIdDto } from './channel-id.dto';

export class ChannelMessageDto extends ChannelIdDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
