import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ImgController } from './img.controller';
import { ImgService } from './img.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ImgController],
  providers: [ImgService]
})
export class ImgModule {}
