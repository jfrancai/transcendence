import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ImgModule } from './img/img.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import envSchema from './env.validation';
import configuration from './config/configuration';
import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      validationSchema: envSchema,
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api(.*)']
    }),
    ChatModule,
    AuthModule,
    ImgModule,
    PongModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
