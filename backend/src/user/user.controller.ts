import {
  Controller,
  UseGuards,
  Get,
  Param,
  Body,
  Put,
  Req
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/database/service/users.service';
import { RemoveService } from './remove/remove.service';

type UserDto = {
  id: string;
  img: string;
  email: string;
  username: string;
  password: string;
  twoAuthOn: boolean;
  twoAuthSecret: string | null;
  apiToken: string | null;
  connectedChat: boolean;
  friendList: string[];
  blockList: string[];
};

@Controller('user')
@UseGuards(ApiGuard, JwtAuthGuard)
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly removeService: RemoveService
  ) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.removeService.removeSensitiveData({ username });
  }

  @Put('update')
  async updateUser(
    @Req() req: any,
    @Body() updateObject: Prisma.UsersUpdateInput
  ) {
    await this.usersService.updateUser(req.user, updateObject);
  }
}
