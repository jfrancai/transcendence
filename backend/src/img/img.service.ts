import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'node:fs';
import * as crypto from 'crypto';

@Injectable()
export class ImgService {
  private readonly logger = new Logger('ImgService');

  constructor() {
    this.logger.log('ImgService Init...');
  }

  writeFile(file: Express.Multer.File) {
    const fileName = crypto.randomBytes(16).toString('hex');
    let flag: boolean = false;
    let fileExt: string = '';

    if (file.mimetype === 'image/png') {
      fileExt = '.png';
    } else if (file.mimetype === 'image/jpeg') {
      fileExt = '.jpeg';
    }

    fs.writeFile(
      join(__dirname, `../../img/${fileName}${fileExt}`),
      file.buffer,
      (err) => {
        if (err) {
          flag = true;
          this.logger.error(`Error writing file: ${err}`);
        } else {
          this.logger.log(`File in img ${fileName}${fileExt} written`);
        }
      }
    );
    return flag ? '' : `${fileName}${fileExt}`;
  }

  deleteFile(path: string) {
    if (path.includes('default.jpg')) return;

    fs.unlink(path, (err) => {
      if (err) {
        this.logger.log(`file doesn't exist ${path}`);
      } else {
        this.logger.log(`file delete ${path}`);
      }
    });
  }

  // send the extension of the image important for react so you can show the image properly
  imageToBase64(path: string | undefined) {
    if (path && fs.existsSync(path)) {
      const data: string = fs.readFileSync(path, 'base64');
      if (path.includes('.jpeg') || path.includes('.jpg')) {
        return { img: data, ext: '.jpeg' };
      }
      return { img: data, ext: '.png' };
    }
    return null;
  }
}
