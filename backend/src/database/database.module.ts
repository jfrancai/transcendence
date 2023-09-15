import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UsersService } from './service/users.service';
import { MessageService } from './service/message.service';

@Module({
  providers: [PrismaService, UsersService, MessageService],
  exports: [UsersService, MessageService]
})
export class DatabaseModule {}
