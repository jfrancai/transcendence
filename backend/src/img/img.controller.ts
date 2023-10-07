import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  UploadedFile,
  Logger,
  UseInterceptors,
  UseGuards,
  Param
} from '@nestjs/common';
import { join } from 'path';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import IUsers from 'src/database/service/interface/users';
import { ImgService } from './img.service';
import { FileValidationPipe } from './pipe/file-validation.pipe';

@Controller('img')
export class ImgController {
  private logger = new Logger('ImgController');

  constructor(
    private readonly imgService: ImgService,
    private readonly authService: AuthService
  ) {
    this.logger.log('ImgController Init...');
  }

  @Post('upload')
  @UseGuards(ApiGuard, JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Req() req: any,
    @Res() res: any,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File
  ) {
    const user = await this.authService.findUser(req.user);
    if (!user) return;

    const fileName = this.imgService.writeFile(file);
    if (!fileName) return;

    this.imgService.deleteFile(user.img);
    const { twoAuthOn, twoAuthSecret, ...remaningUser } = user;
    const properlyFormatedUser: IUsers = {
      ...remaningUser,
      twoAuth: {
        twoAuthOn,
        twoAuthSecret: twoAuthSecret || undefined
      }
    };
    this.authService.updateUser(properlyFormatedUser, {
      img: `${join(__dirname, `../../img/${fileName}`)}`
    });
    res.status(200).json({ message: 'ok' });
  }

  @Get('download')
  @UseGuards(ApiGuard, JwtAuthGuard)
  async getUserImage(@Req() req: any) {
    const user = await this.authService.findUser(req.user);
    if (user) {
      const imgValue = this.imgService.imageToBase64(user?.img);
      return { username: user.username, ...imgValue };
    }
    return null;
  }

  // use this route for fetching on specific user
  @Get('download')
  @UseGuards(ApiGuard, JwtAuthGuard)
  async findUserImage(@Param('username') toFind: string) {
    const user = await this.authService.findUser({ username: toFind });
    if (user) {
      return this.imgService.imageToBase64(user?.img);
    }
    return null;
  }
}
