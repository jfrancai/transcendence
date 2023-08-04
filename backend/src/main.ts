import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { nestCsrf, CsrfFilter } from 'ncsrf';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(nestCsrf());
  app.useGlobalFilters(new CsrfFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
