import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';
import { lastValueFrom, map } from 'rxjs';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Request } from 'express';
import { IUsers } from 'src/database/service/interface/users';
import { CONST_URL } from './constants';
import { UsersService } from '../database/service/users.service';

type CreateUserDto = { email: string; username: string; password: string };
type UpdateUserDto = {
  img?: string;
  email?: string;
  username?: string;
  apiToken?: string;
  twoAuthSecret?: string;
  twoAuthOn?: boolean;
  maxAge?: number;
};

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
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.logger.log('AuthService Init...');
  }

  // generate QrCode
  async generateQrCodeDataUrl(optAuthUrl: string) {
    return toDataURL(optAuthUrl);
  }

  // generate 2FA Secret for the user
  async generate2FASecret(user: IUsers) {
    const secret = authenticator.generateSecret();
    const optAuthUrl = authenticator.keyuri(
      user.email,
      'ft_transcendence',
      secret
    );

    await this.updateUser(user, { twoAuthSecret: secret });
    return {
      secret,
      optAuthUrl
    };
  }

  async findUserByJWT(token: string) {
    try {
      this.jwtService.verify(token);
      const payload: any = this.jwtService.decode(token);
      const { email } = payload;
      return await this.usersService.getFullUserWithEmail(email);
    } catch (error) {
      this.logger.warn(error);
      return null;
    }
  }

  // login 2Fa
  async loginWith2Fa(userWithoutPsw: Partial<IUsers>) {
    const payload = {
      email: userWithoutPsw.email,
      username: userWithoutPsw.username,
      twoAuthOn: userWithoutPsw.twoAuth!.twoAuthOn!
    };

    return {
      email: payload.email,
      username: payload.username,
      access_token: this.jwtService.sign(payload)
    };
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, twoAuthOn, twoAuthSecret, ...userInfo } = user;

      let defaultAuthOn: boolean = false;
      let defaultAuthSecret: string | undefined;

      // i have to do this because typescript fuck me
      if (twoAuthOn) defaultAuthOn = true;
      if (twoAuthSecret) defaultAuthSecret = twoAuthSecret;

      const properFormatUser: Partial<IUsers> = {
        ...(userInfo as Partial<IUsers>),
        twoAuth: {
          twoAuthOn: defaultAuthOn,
          twoAuthSecret: defaultAuthSecret
        }
      };
      return isMatch ? properFormatUser : null;
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

    const info$ = this.httpService
      .get('https://api.intra.42.fr/v2/me', config)
      .pipe(map((response: AxiosResponse) => response.data));
    const info = await lastValueFrom(info$);
    const { email } = info;
    return this.usersService.getUser({ email });
  }

  // get Token from api 42
  async callbackToken(code: string, state: string) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    if (clientId !== undefined && clientSecret !== undefined) {
      try {
        const promise = await this.httpService.axiosRef
          .postForm(CONST_URL, {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: 'http://localhost:3000/auth/callback',
            state
          })
          .then((res: AxiosResponse) => res.data);
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
    if (!token || !hash) {
      throw new HttpException('Missing Token', HttpStatus.FORBIDDEN);
    }

    const valid = bcrypt.compareSync(token, hash);
    if (!valid) {
      throw new HttpException(
        'Invalid Token as been modified',
        HttpStatus.FORBIDDEN
      );
    }
    return token;
  }

  // verify the two-auth code with secret
  twoAuthCodeValid(twoAuthCode: string, user: IUsers) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return authenticator.verify({
      token: twoAuthCode,
      secret: user.twoAuth.twoAuthSecret!
    });
  }
}
