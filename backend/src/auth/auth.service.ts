import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../database/service/users.service';
import IUsers from '../database/service/interface/users';
import CONST_SALT from './constants';

/*
 * TODO:
 *   - In UsersService add function so we can querry,
 *       by name or email for CRUD that doesn't already do it.
 *   - Finish Auth Service and create Auth Guard
 *   - Check to use the API 42 when login try to implements the backend capabilities.
 */
export function checkHash(password: string, toCompare: string) {
  return bcrypt.compare(password, toCompare);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(user: IUsers) {
    const salt = await bcrypt.genSalt(CONST_SALT);
    const updatedUser: IUsers = {
      email: user.email,
      name: user.name,
      password: await bcrypt.hash(user.password, salt)
    };
    const ret = await this.usersService.createUser(updatedUser);

    return ret;
  }

  async signIn(password: string, username?: string, email?: string) {
    const user = await this.usersService.getUser(username, email);

    if (user === null) {
      throw new BadRequestException();
    }
    if (!checkHash(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
