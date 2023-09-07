import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { RedirectionFilter } from './filter/redirect-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  // app start
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RedirectionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
