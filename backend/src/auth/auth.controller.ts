import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  UsePipes,
  UseGuards,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';
import { ApiGuard } from '@api';
import { JwtAuthGuard } from '@jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ContentValidationPipe, createSchema } from './pipes/validation.pipe';
import { CreateDto } from './dto/create-dto';
import { CONST_INFO_URL, CONST_LOCAL_LOGIN, CONST_SALT } from './constants';
import { AuthService } from './auth.service';
import { IUsers } from '../database/service/interface/users';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {
    this.logger.log('AuthController Init...');
  }

  @Get('login_only')
  @UseGuards(ApiGuard, JwtAuthGuard)
  @HttpCode(200)
  getLogedUser(@Req() req: any) {
    return req.user;
  }

  @Post('2fa-generate')
  @UseGuards(ApiGuard, JwtAuthGuard)
  @HttpCode(200)
  async generate2Fa(@Req() req: any, @Res() res: any) {
    const { optAuthUrl } = await this.authService.generate2FASecret(req.user);
    return this.authService.pipeQrCodeStream(res, optAuthUrl);
  }

  @Post('2fa-turn-on')
  @UseGuards(ApiGuard, JwtAuthGuard)
  @HttpCode(200)
  async turnOnTwoAuthFactor(
    @Req() req: any,
    @Res() res: any,
    @Body('twoFactorAuthCode') twoFactorAuthCode: string
  ) {
    const isCodeValid = this.authService.twoAuthCodeValid(
      twoFactorAuthCode,
      req.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.updateUser(req.user, {
      twoAuthOn: true
    });
    res.json({ message: 'ok' });
  }

  @Get('2fa-login')
  @UseGuards(ApiGuard)
  @HttpCode(200)
  async authenticatePage(@Res() res: Response) {
    res.status(200).json({ message: 'ok' });
  }

  @Post('2fa-login')
  @UseGuards(ApiGuard, LocalAuthGuard)
  @HttpCode(200)
  async authenticate(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body('twoFactorAuthCode') twoFactorAuthCode: string
  ) {
    const isCodeValid = this.authService.twoAuthCodeValid(
      twoFactorAuthCode,
      req.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const jsonWebToken = await this.authService.loginWith2Fa(req.user);
    res.setHeader('Authorization', `Bearer ${jsonWebToken.access_token}`);
    return jsonWebToken;
  }

  @Get('login')
  @UseGuards(ApiGuard)
  @HttpCode(200)
  getLogin(@Res() res: Response) {
    res.json({ message: 'ok' });
  }

  @Post('login')
  @UseGuards(ApiGuard, LocalAuthGuard)
  @HttpCode(200)
  async login(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const jsonWebToken = await this.authService.login(req.user);

    res.setHeader('Authorization', `Bearer ${jsonWebToken.access_token}`);
    return jsonWebToken;
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.callbackToken(code, state);

    if (token === null) {
      throw new HttpException(
        "Couldn't achieve token resolution",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const salt = await bcrypt.genSalt(CONST_SALT);
    const hash = await bcrypt.hash(token.access_token, salt);
    const tokenAndHash = `${token.access_token}|${hash}`;
    const user = await this.authService.findUserWithToken(token.access_token);
    if (!user) {
      res.cookie('api_token', tokenAndHash, {
        maxAge: 360 * 1000,
        sameSite: 'lax',
        httpOnly: true
      });
      res.status(301).redirect('/auth/create_profile');
    } else {
      const usernameAndHash = `${user.username}|${hash}`;
      res.cookie('api_token', usernameAndHash, {
        maxAge: token.expires_in * 1000,
        sameSite: 'lax',
        httpOnly: true
      });
      await this.authService.updateUser(user as Partial<IUsers>, {
        apiToken: token.access_token
      });
      if (user && user.twoAuthOn) res.status(301).redirect('/auth/2fa-login');
      res.status(301).redirect('/auth/login');
    }
  }

  // this might change in the future.
  @Get('create_profile')
  @UseGuards(ApiGuard)
  returnCreate(@Res() res: Response) {
    res.status(200).json({ message: 'ok' });
  }

  // create user profile
  @Post('create_profile')
  @UseGuards(ApiGuard)
  @UsePipes(new ContentValidationPipe(createSchema))
  async createUser(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() user: CreateDto
  ) {
    try {
      const token = this.authService.getTokenFromCookieCreateProfile(req);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const info = await axios
        .get('https://api.intra.42.fr/v2/me', config)
        .then((resp: AxiosResponse) => resp.data);

      const { email } = info;
      const salt = await bcrypt.genSalt(CONST_SALT);
      const passwordHash = await bcrypt.hash(user.password, salt);
      const updatedUser = {
        email,
        username: user.username,
        password: passwordHash,
        apiToken: token
      };

      const promise = await this.authService.createUser(updatedUser);
      if (!promise) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: 'Failed to create user, user might already exist.'
        });
      }

      const tokenInfo = await axios
        .get(CONST_INFO_URL, config)
        .then((resp: AxiosResponse) => resp.data);

      const hash = await bcrypt.hash(token, salt);
      const usernameAndHash = `${user.username}|${hash}`;
      res.cookie('api_token', usernameAndHash, {
        maxAge: tokenInfo.expires_in_seconds * 1000,
        sameSite: 'lax',
        httpOnly: true
      });

      const loginInfo = {
        username: user.username,
        password: user.password
      };

      const jsonWebToken = await axios
        .post(CONST_LOCAL_LOGIN, JSON.stringify(loginInfo), {
          headers: {
            Cookie: `api_token=${usernameAndHash}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response: AxiosResponse) => response.data);
      res.setHeader('Authorization', `Bearer ${jsonWebToken.access_token}`);
      return res.status(HttpStatus.CREATED).json({ message: 'ok' });
    } catch (e) {
      throw new HttpException(`${e.message}`, e.code);
    }
  }

  // will be replaced with the actual profile information
  @Get('profile')
  @UseGuards(ApiGuard)
  profile() {
    return 'profile';
  }
}
