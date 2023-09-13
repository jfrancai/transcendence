import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import SessionStoreModule from './session-store/session-store.module';
import MessageStoreModule from './message-store/message-store.module';
import ChatGateway from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway],
  imports: [ConfigModule, SessionStoreModule, MessageStoreModule, AuthModule]
})
export default class ChatModule {}
