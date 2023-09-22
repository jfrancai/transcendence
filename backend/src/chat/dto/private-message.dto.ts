import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PrivateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly receiverId: string;
}
