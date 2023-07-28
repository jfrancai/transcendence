import {
  Controller,
  Post,
  Res,
  HttpException,
  HttpStatus,
  UsePipes,
  Body
} from '@nestjs/common';
import { Response } from 'express';
import {
  ContentValidationPipe,
  signInSchema,
  signUpSchema
} from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import SignInDto from './dto/sigin-dto';
import SignUpDto from './dto/signup-dto';

@Controller('auth')
class AuthController {
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
  @UsePipes(new ContentValidationPipe(signInSchema))
  async signIn(@Body() signInDto: SignInDto) {
    const ret = await this.authService.signIn(
      {
        email: signInDto.email,
        name: signInDto.name
      },
      signInDto.password
    );
    return ret;
  }
}

export default AuthController;
