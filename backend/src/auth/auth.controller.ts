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
import axios from 'axios';
import { AuthService } from './auth.service';
import { ContentValidationPipe, createSchema } from '../pipes/validation.pipe';
import { ApiGuard } from './guards/auth.guard';
import { CreateDto } from './dto/create-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  returnLogin(@Res() res: Response) {
    res.status(200).json({ message: 'ok' });
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
  returnCreate() {
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
    const updatedUser = {
      ...user,
      email,
      apiToken: req.cookies.api_token
    };
    await this.authService.createUser(updatedUser);
  }

  @Get('profile')
  @UseGuards(ApiGuard)
  profile() {
    return 'profile';
  }
}
