import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class PrivateMessageDto extends UserDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
