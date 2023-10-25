import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './adapters/SocketIOAdapter';

async function bootstrap() {
  // app start
  const corsOption: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(3000);
}
bootstrap();
