import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppService from './app.service';
import AppController from './app.controller';
import AuthModule from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export default class AppModule {}
