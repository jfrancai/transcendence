import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    if (req && 'api_token' in req.cookies) {
      const config = {
        headers: { Authorization: `Bearer ${req.cookies.api_token}` }
      };

      const token = await axios
        .get('https://api.intra.42.fr/oauth/token/info', config)
        .then((res) => res.data);

      if (!token) return false;
      return true;
    }
    return false;
  }
}
