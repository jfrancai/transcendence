import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { RedirectionException } from 'src/exception/redirect-execption';
import { AuthService, MethodCookie } from '../auth.service';

/* old behavior that would check everytime if the token is valid by sending a request to the api
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

*/

@Injectable()
export class ApiGuard implements CanActivate {
  private logger = new Logger('ApiGuard');

  constructor(private readonly authService: AuthService) {}

  // need to re-add the old behavior that follow the new one with extra features on it
  async canActivate(ctx: ExecutionContext) {
    this.logger.log('ApiGuard Init...');
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

    /*
     * throw exception so src/filter/redirect-exception.filter.ts redirect to generate a new token
     * this is done this way because if you do a redirection directly from your guards
     * it will rewrite headers from the route handler
     */
    throw new RedirectionException();
  }
}
