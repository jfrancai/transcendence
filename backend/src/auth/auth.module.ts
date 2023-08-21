import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PassportModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
