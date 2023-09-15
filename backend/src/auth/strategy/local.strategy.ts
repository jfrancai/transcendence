import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { IUsers } from 'src/database/service/interface/users';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<Partial<IUsers>> {
    const userWithoutPassword = await this.authService.validateUser(
      username,
      password
    );
    if (!userWithoutPassword) {
      throw new UnauthorizedException();
    }
    return userWithoutPassword;
  }
}
