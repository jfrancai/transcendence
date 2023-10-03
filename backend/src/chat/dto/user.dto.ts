import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  readonly userID: string;
}
