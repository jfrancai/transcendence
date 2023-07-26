import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import AppService from './app.service';
import AppController from './app.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService]
})
export default class AppModule {}
