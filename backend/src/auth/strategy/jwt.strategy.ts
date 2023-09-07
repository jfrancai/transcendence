import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/database/service/users.service';

type TokenPayload = { email: string; username: string; access_token: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.getUser({
      username: payload.username,
      email: payload.email
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
