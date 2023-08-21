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
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ContentValidationPipe,
  loginSchema,
  createSchema
} from '../pipes/validation.pipe';
import { ApiGuard } from './guards/auth.guard';
import { LoginDto } from './dto/login-dto';
import { CreateDto } from './dto/create-dto';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(ApiGuard)
  returnLogin() {
    return 'login';
  }

  @Post('login')
  @UseGuards(ApiGuard)
  @UsePipes(new ContentValidationPipe(loginSchema))
  async login(@Body() user: LoginDto) {
    const match = await this.authService.validateUser(
      user.username,
      user.password
    );
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

    console.log(JSON.stringify(token, null, 4));

    res.cookie('api_token', token.access_token, {
      maxAge: token.expires_in * 1000,
      httpOnly: true
    });

    const user = await this.authService.findUserByToken(token.access_token);
    if (!user) {
      res.status(301).redirect('/auth/create_oauth');
    } else {
      res.status(301).redirect('/auth/profile');
    }
  }

  @Get('create_oauth')
  @UseGuards(ApiGuard)
  returnCreate(@Req() req: any) {
    console.log(
      `create_oauth route cookies: ${JSON.stringify(req.cookies, null, 4)}`
    );
    return 'OAuth';
  }

  @Post('create_oauth')
  @UseGuards(ApiGuard)
  @UsePipes(new ContentValidationPipe(createSchema))
  async createUser(@Req() req: any, @Body() user: CreateDto) {
    const config = {
      headers: { Authorization: `Bearer ${req.cookies.api_token}` }
    };
    const info = await axios
      .get('https://api.intra.42.fr/v2/me', config)
      .then((res) => res.data);

    const { email } = info;
    user.email = email;
    await this.authService.createUser(user);
  }

  @Get('profile')
  @UseGuards(ApiGuard)
  profile(@Req() req: any) {
    return req.user;
  }
}
