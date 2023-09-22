import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;

  @IsOptional()
  @IsString()
  readonly password: string = '';
}
