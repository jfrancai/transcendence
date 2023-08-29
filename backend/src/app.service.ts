import { Injectable, Request, Response } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';

@Injectable()
export class AppService {
  createToken(req: Request, res: Response) {
    const {
      generateToken,
      doubleCsrfProtection
    } = doubleCsrf({
      getSecret: () => {
        const secret = process.env.CSRF_SECRET;
        if (!secret) {
          throw new Error('Error: Invalid .env missing "CSRF_SECRET"');
        }
        return secret;
      },
      cookieOptions: {
        secure: false,
      }
    })
  }
}
