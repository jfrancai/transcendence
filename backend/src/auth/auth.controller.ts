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
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { ContentValidationPipe, signUpSchema } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import SignUpDto from './dto/signup-dto';

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
  async signIn(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
