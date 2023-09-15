import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import MessageStoreModule from './message-store/message-store.module';
import ChatGateway from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway],
  imports: [ConfigModule, MessageStoreModule, AuthModule, DatabaseModule]
})
export default class ChatModule {}
