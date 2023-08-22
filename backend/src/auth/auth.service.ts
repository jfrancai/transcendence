import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CONST_URL } from './constants';
import { UsersService } from '../database/service/users.service';

type CreateUserDto = { email: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  // create user
  async createUser(user: CreateUserDto) {
    const promise = await this.usersService.createUser(user);
    return promise;
  }

  // get user assiocieted with the current token
  async findUserByToken(token: string) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const info = await axios
      .get('https://api.intra.42.fr/v2/me', config)
      .then((res: AxiosResponse) => res.data);
    const { email } = info;
    return this.usersService.getUser({ email });
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

  storeApiTokenInCookie(res: any, token: any) {
    res.cookie('api_token', token.access_token, {
      maxAge: token.expires_in,
      httpOnly: true
    });
  }
}
