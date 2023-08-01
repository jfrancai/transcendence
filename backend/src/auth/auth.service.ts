import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../database/service/users.service';
import IUsers from '../database/service/interface/users';
import IPUsers from '../database/service/interface/partial.users';
import CONST_SALT from './constants';

/*
 * TODO:
 *   - Finish Auth Service and create Auth Guard
 *   - Check @nestjs/passport for auth guard and JWT continual login
 *   - Check to use the API 42 when login try to implements the backend capabilities.
 *   - Passport use for goole auth.
 */
type ReturnUser = { id: number; username: string; email: string };

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
      username: user.username,
      password: await bcrypt.hash(user.password, salt)
    };
    const ret = await this.usersService.createUser(updatedUser);

    return ret;
  }

  async validateUser(
    pUsers: IPUsers,
    pass: string
  ): Promise<ReturnUser | null> {
    const user = await this.usersService.getUser(pUsers);

    if (user && (await checkHash(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
