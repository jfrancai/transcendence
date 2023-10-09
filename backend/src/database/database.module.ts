import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UsersService } from './service/users.service';
import { MessageService } from './service/message.service';
import { ChannelService } from './service/channel.service';

@Module({
  providers: [PrismaService, UsersService, MessageService, ChannelService],
  exports: [UsersService, MessageService, ChannelService]
})
export class DatabaseModule {}
