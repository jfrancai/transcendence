import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly chanId: string;
}
