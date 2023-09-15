import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { IUsers } from 'src/database/service/interface/users';
import { CONST_URL } from './constants';
import { UsersService } from '../database/service/users.service';

type CreateUserDto = { email: string; username: string; password: string };
type UpdateUserDto = { email?: string; username?: string; apiToken?: string };

export enum MethodCookie {
  DEFAULT = 1, // getTokenFromCookie
  PROFILE, // getTokenFromCookieCreateProfile
  MAX_VALUE
}

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.logger.log('AuthService Init...');
  }

  // login method
  async login(userWithoutPsw: Partial<IUsers>) {
    const payload = {
      username: userWithoutPsw.username,
      email: userWithoutPsw.email
    };

    return {
      email: payload.email,
      username: payload.username,
      access_token: this.jwtService.sign(payload)
    };
  }

  // validate user password
  async validateUser(
    username: string,
    pass: string
  ): Promise<Partial<IUsers> | null> {
    try {
      const user = await this.findUser({ username });
      if (!user) return null;
      const isMatch = await bcrypt.compare(pass, user.password);

      // eslint-disable-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return isMatch ? (userWithoutPassword as unknown as IUsers) : null;
    } catch (e) {
      return null;
    }
  }

  // update user
  async updateUser(userInfo: Partial<IUsers>, data: UpdateUserDto) {
    return this.usersService.updateUser(userInfo, data);
  }

  // create user
  async createUser(user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  /**
   * @param {Partial<IUsers>} userToFind - Object containing information about the user to find
   * @param {string=} userToFind.email - email of the user
   * @param {string=} userToFind.username - username of the user
   */
  async findUser(userToFind: Partial<IUsers>) {
    return this.usersService.getUser(userToFind);
  }

  // get user assiocieted with the current token
  async findUserWithToken(token: string) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const res: AxiosResponse = await axios.get(
        'https://api.intra.42.fr/v2/me',
        config
      );
      const { email } = res.data;
      return await this.usersService.getUser({ email });
    } catch (error) {
      this.logger.warn(error);
      return null;
    }
  }

  async findUserWithJWT(token: string) {
    try {
      this.jwtService.verify(token);
      const payload: any = this.jwtService.decode(token);
      const { email } = payload;
      return await this.usersService.getUser({ email });
    } catch (error) {
      this.logger.warn(error);
      return null;
    }
  }

  // get Token from api 42
  async callbackToken(code: string, state: string) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    if (clientId !== undefined && clientSecret !== undefined) {
      try {
        const promise = await axios
          .postForm(CONST_URL, {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: 'http://localhost:3000/auth/callback',
            state
          })
          .then((res) => res.data);
        return promise;
      } catch (e: any) {
        throw new HttpException(
          'Token exchange failed',
          HttpStatus.BAD_REQUEST
        );
      }
    }
    return null;
  }

  // default getTokenFromCookie
  async getTokenFromCookie(request: Request) {
    const usernameAndHash: string = request.cookies.api_token;
    const [username, hash] = usernameAndHash.split('|');

    const user = await this.usersService.getUser({ username });
    if (!user) {
      throw new HttpException(
        'Invalid Token username dont match',
        HttpStatus.FORBIDDEN
      );
    }

    // check token
    if (!user.apiToken) {
      throw new HttpException('Missing Token', HttpStatus.FORBIDDEN);
    } else if (!(await bcrypt.compare(user.apiToken, hash))) {
      throw new HttpException(
        'Invalid Token as been modified',
        HttpStatus.FORBIDDEN
      );
    }
    return user.apiToken;
  }

  // check if we should use getTokenFromCookie default or for profile
  async checkCookieFetchMethod(cookieToCheck: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [shouldCheck, hash] = cookieToCheck.split('|');

    // shouldCheck is either username or token we try to getUser with username
    // if null this mean that shouldCheck is token otherwise username
    const user = await this.usersService.getUser({ username: shouldCheck });
    return user === null ? MethodCookie.PROFILE : MethodCookie.DEFAULT;
  }

  // for create_profile route only
  getTokenFromCookieCreateProfile(request: Request) {
    const tokenAndHash: string = request.cookies.api_token;
    const [token, hash] = tokenAndHash.split('|');

    const valid = bcrypt.compareSync(token, hash);
    if (!valid) {
      throw new HttpException(
        'Invalid Token as been modified',
        HttpStatus.FORBIDDEN
      );
    }
    return token;
  }
}
