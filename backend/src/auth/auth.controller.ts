import {
  Controller,
  Post,
  Res,
  HttpException,
  HttpStatus,
  UsePipes,
  Body,
  Get,
  Request,
  UseGuards,
  Query,
  Req
} from '@nestjs/common';
import { Csrf } from 'ncsrf';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ContentValidationPipe, signUpSchema } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { RefreshAuthGuard } from './passport/refresh-auth.guard';
import SignUpDto from './dto/signup-dto';
import AuthDto from './dto/auth-dto';
import AuthTokenDto from './dto/token-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ContentValidationPipe(signUpSchema))
  async signUp(@Body() signUpDto: SignUpDto, @Res() response: Response) {
    const ret = await this.authService.signUp(signUpDto);

    if (!ret) {
      throw new HttpException(
        'Username or email already exist',
        HttpStatus.CONFLICT
      );
    }
    response.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Account created'
    });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async signIn(@Body() u: AuthDto, @Res({ passthrough: true }) res: Response) {
    const authToken = await this.authService.login(u);
    const { accessToken, refreshToken } = authToken;
    if (accessToken === null && refreshToken === null) {
      throw new HttpException('Invalid user', HttpStatus.FORBIDDEN);
    } else if (accessToken !== null && refreshToken !== null) {
      this.authService.storeTokenInCookie(res, authToken);
      res.status(200).send({ message: 'ok' });
    }
  }

  @Get('refresh')
  @UseGuards(RefreshAuthGuard)
  @Csrf()
  @ApiQuery({ name: 'username' })
  async refreshTokens(
    @Query() query: any,
    @Req() req: any,
    @Res({ passthrough: true }) res: any
  ) {
    const refreshToken = req.cookies.refresh_token;
    const newAuthToken = await this.authService.refreshAccessToken(
      query.username,
      refreshToken
    );
    this.authService.storeTokenInCookie(res, newAuthToken);
    res.status(200).send({ message: 'ok' });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
