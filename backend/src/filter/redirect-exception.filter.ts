import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Response } from 'express';
import { RedirectionException } from 'src/exception/redirect-execption';
import { CONST_FRONTEND_URL } from 'src/auth/constants';

@Catch(RedirectionException)
export class RedirectionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.setHeader('location', CONST_FRONTEND_URL);
    response.status(status).redirect(CONST_FRONTEND_URL);
  }
}
