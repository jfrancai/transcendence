import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectionException extends HttpException {
  constructor() {
    super('Redirect', HttpStatus.FOUND); // 302
  }
}
