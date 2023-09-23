import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveChannelDto {
  @IsNotEmpty()
  @IsString()
  readonly displayName: string;
}
