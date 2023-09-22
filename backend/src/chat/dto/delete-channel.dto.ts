import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;
}
