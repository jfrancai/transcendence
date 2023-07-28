import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  Body
} from '@nestjs/common';
import {
  ContentValidationPipe,
  signInSchema,
  signUpSchema
} from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import SignInDto from './dto/sigin-dto';
import SignUpDto from './dto/signup-dto';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @UsePipes(new ContentValidationPipe(signUpSchema))
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ContentValidationPipe(signInSchema))
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.password,
      signInDto.name,
      signInDto.email
    );
  }
}

export default AuthController;
