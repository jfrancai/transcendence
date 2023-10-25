import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AuthService, MethodCookie } from '../auth.service';

@Injectable()
export class ApiGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext) {
    const http = ctx.switchToHttp();
    const req = http.getRequest();
    if (req && 'api_token' in req.cookies) {
      let tokenOrUsername: string = '';

      const fetchMethod = await this.authService.checkCookieFetchMethod(
        req.cookies.api_token
      );
      if (fetchMethod === MethodCookie.DEFAULT) {
        tokenOrUsername = await this.authService.getTokenFromCookie(req);
        return true;
      }

      tokenOrUsername = this.authService.getTokenFromCookieCreateProfile(req);
      const user = this.authService.findUserWithToken(tokenOrUsername);
      if (!user && req.path !== '/auth/create_profile') {
        throw new HttpException(
          {
            status: HttpStatus.SEE_OTHER,
            headers: { Location: '/auth/create_profile' }
          },
          HttpStatus.SEE_OTHER
        );
      }
      return true;
    }
    return false;
  }
}
