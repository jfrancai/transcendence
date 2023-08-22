import * as crypto from 'crypto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { CONST_CALLBACK_URL } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext) {
    const http = ctx.switchToHttp();
    const req = http.getRequest();
    const resp = http.getResponse();
    if (req && 'api_token' in req.cookies) {
      const config = {
        headers: { Authorization: `Bearer ${req.cookies.api_token}` }
      };

      // check if token is valid, check error response need to be 401 redirect to callback
      const info = await axios
        .get('https://api.intra.42.fr/oauth/token/info', config)
        .then((res: AxiosResponse) => res.data)
        .catch((error: AxiosError) => {
          if (error.response?.status === 401) {
            const genState = crypto.randomBytes(32).toString('hex');
            resp
              .status(302)
              .redirect(`${CONST_CALLBACK_URL}&state=${genState}`);
          }
        });

      if (!info) return false;

      const user = await this.authService.findUserByToken(
        req.cookies.api_token
      );
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.SEE_OTHER,
            headers: { Location: '/auth/create_oauth' }
          },
          HttpStatus.SEE_OTHER
        );
      }
      return true;
    }
    return false;
  }
}
