import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UsersService } from './service/users.service';
import { MessageService } from './service/message.service';
import { ChannelService } from './service/channel.service';
import { ChanInviteService } from './service/chan-invite.service';
import { ChanRestrictService } from './service/chan-restrict.service';

@Module({
  providers: [
    PrismaService,
    UsersService,
    MessageService,
    ChannelService,
    ChanInviteService,
    ChanRestrictService
  ],
  exports: [
    UsersService,
    MessageService,
    ChannelService,
    ChanInviteService,
    ChanRestrictService
  ]
})
export class DatabaseModule {}
