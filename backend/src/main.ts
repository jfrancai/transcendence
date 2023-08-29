import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  // app start
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
