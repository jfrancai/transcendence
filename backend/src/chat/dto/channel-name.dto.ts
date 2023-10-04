import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChannelNameDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly chanName: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  readonly chanID: string;
}
