import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AdminChannelDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly displayName: string;
}
