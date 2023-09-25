import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PrivateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  readonly receiverId: string;
}
