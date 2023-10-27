import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UsersService } from './service/users.service';
import { MessageService } from './service/message.service';
import { ChannelService } from './service/channel.service';
import { MatchService } from './service/match.service';

@Module({
  providers: [
    PrismaService,
    UsersService,
    MessageService,
    ChannelService,
    MatchService
  ],
  exports: [UsersService, MessageService, ChannelService, MatchService]
})
export class DatabaseModule {}
