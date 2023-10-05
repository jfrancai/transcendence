import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChannelIdDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  readonly chanID: string;
}
