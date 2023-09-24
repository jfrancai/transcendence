import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChannelMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly chanName: string;
}
