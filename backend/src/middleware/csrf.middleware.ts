import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { generateToken } = doubleCsrf({
      getSecret: () => {
        const secret = process.env.CSRF_SECRET;
        if (!secret) {
          throw new Error('Error: Invalid .env missing "CSRF_SECRET"');
        }
        return secret;
      },
      cookieOptions: {
        secure: false
      }
    });
    const csrfToken = generateToken(req, res);

    res.cookie('csrf-token', csrfToken, { httpOnly: true });
    res.locals.csrfToken = csrfToken;

    next();
  }
}
