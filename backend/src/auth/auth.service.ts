import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../database/service/users.service';
import IUsers from '../database/service/interface/users';
import IPUsers from '../database/service/interface/partial.users';
import CONST_SALT from './constants';
import AuthDto from './dto/auth-dto';
import AuthTokenDto from './dto/token-dto';

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

function expiresInMs(expires: string): number {
  if (expires.indexOf('d') !== -1) {
    return 1000 * 60 * 60 * 24 * parseInt(expires, 10);
  } else if (expires.indexOf('h') !== -1) {
    return 1000 * 60 * 60 * parseInt(expires, 10);
  } else if (expires.indexOf('m') !== -1) {
    return 1000 * 60 * parseInt(expires, 10);
  }
  return 1000 * parseInt(expires, 10);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // create tokens
  async getTokens(username: string): Promise<AuthTokenDto> {
    const tokens = await Promise.all([
      this.jwtService.signAsync(
        {
          username
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRESIN')
        }
      ),
      this.jwtService.signAsync(
        {
          username
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRESIN')
        }
      )
    ]);

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1]
    };
  }

  // Refresh Token
  async refreshAccessToken(
    username: string,
    refreshToken: string
  ): Promise<AuthTokenDto> {
    const user = await this.usersService.getUser({ username });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acces Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      user.refreshToken,
      refreshToken
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.username);
    return tokens;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const salt = await bcrypt.genSalt(CONST_SALT);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateUserById(id, {
      refreshToken: hashedRefreshToken
    });
  }

  storeTokenInCookie(res: any, authToken: AuthTokenDto) {
    const accessExpires = this.configService.get<string>('JWT_EXPIRESIN');
    const refreshExpires = this.configService.get<string>(
      'JWT_REFRESH_EXPIRESIN'
    );
    console.log(`EXPIRESIN: ${accessExpires}, ${refreshExpires}`);
    if (accessExpires !== undefined && refreshExpires !== undefined) {
      res.cookie('access_token', authToken.accessToken, {
        maxAge: expiresInMs(accessExpires),
        httpOnly: true
      });
      res.cookie('refresh_token', authToken.refreshToken, {
        maxAge: expiresInMs(refreshExpires),
        httpOnly: true
      });
    }
  }

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

  async login(user: AuthDto) {
    const foundUser = await this.usersService.getUser(user);

    if (!foundUser) {
      return {
        accessToken: null,
        refreshToken: null
      };
    }
    console.log(`foundUser: ${JSON.stringify(foundUser, null, 4)}`);
    const tokens = await this.getTokens(foundUser.username);
    await this.updateRefreshToken(foundUser.id, tokens.refreshToken);
    console.log(`tokens: ${JSON.stringify(tokens, null, 4)}`);
    return tokens;
  }
}
