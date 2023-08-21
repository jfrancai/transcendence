import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CONST_URL, CONST_SALT } from './constants';
import { UsersService } from '../database/service/users.service';
import { LoginDto } from './dto/login-dto';
import { CreateDto } from './dto/create-dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  // create user
  async createUser(user: CreateDto) {
    const salt = await bcrypt.genSalt(CONST_SALT);
    const updatedUser = {
      ...user,
      password: await bcrypt.hash(user.password, salt)
    };
    await this.usersService.createUser(updatedUser);
  }

  // validate user (check if password is valid for login)
  async validateUser(username: string, pass: string) {
    const user = await this.usersService.getUser({ username });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const valid = await bcrypt.compare(pass, user.password);
    if (valid) {
      // remove all sensitive information before return
      const { password, accessToken, refreshToken, apiToken, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  // get user assiocieted with the current token
  async findUserByToken(token: string) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const info = await axios
      .get('https://api.intra.42.fr/v2/me', config)
      .then((res) => res.data);

    const { email } = info;
    console.log('email: ', email);
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
        console.error(e, e.message);
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
