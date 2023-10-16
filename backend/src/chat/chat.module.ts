import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import ChatGateway from './chat.gateway';
import { ImgModule } from '../img/img.module';

@Module({
  controllers: [],
  providers: [ChatGateway],
  imports: [ConfigModule, AuthModule, DatabaseModule, ImgModule]
})
export default class ChatModule {}
