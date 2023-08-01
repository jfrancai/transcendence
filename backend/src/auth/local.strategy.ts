import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const profileUsername = await this.authService.validateUser(
      { username },
      password
    );
    const profileEmail = await this.authService.validateUser(
      { email: username },
      password
    );

    if (!profileUsername && !profileEmail) {
      throw new HttpException('Login Failed...', HttpStatus.UNAUTHORIZED);
    }

    // should never be null
    return profileUsername !== null ? profileUsername : profileEmail;
  }
}
