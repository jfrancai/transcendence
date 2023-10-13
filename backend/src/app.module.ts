import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ImgModule } from './img/img.module';
import { UserModule } from './user/user.module';
import ChatModule from './chat/chat.module';
import envSchema from './env.validation';
import configuration from './config/configuration';

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
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
