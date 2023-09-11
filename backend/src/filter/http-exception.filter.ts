import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RedirectionException } from 'src/exception/redirect-execption';

/* eslint class-methods-use-this: 0 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (
      status === 403 &&
      (exception.message === 'Invalid Token as been modified' ||
        exception.message === 'Missing Token' ||
        exception.message === 'Invalid Token username dont match')
    ) {
      throw new RedirectionException();
    }
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
