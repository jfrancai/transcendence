import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { RemoveService } from './service/remove.service';
import { PongModule } from 'src/pong/pong.module';

@Module({
  imports: [DatabaseModule, AuthModule, PongModule],
  controllers: [UserController],
  providers: [RemoveService]
})
export class UserModule {}
