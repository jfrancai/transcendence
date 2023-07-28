import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UsersService } from './service/users.service';

@Module({
  providers: [PrismaService, UsersService],
  exports: [UsersService]
})
export class DatabaseModule {}
