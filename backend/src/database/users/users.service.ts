import { Injectable } from '@nestjs/common';
import { Users, Prisma } from '@prisma/client';
import PrismaService from './prisma.service';

@Injectable()
export default class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(toFind: number) {
    return this.prisma.users.findUnique({
      where: {
        id: toFind
      }
    });
  }

  async deleteUser(id: number): Promise<Users> {
    return this.prisma.users.delete({
      where: {
        id
      }
    });
  }

  async updateUser(id: number, user: Prisma.UsersUpdateInput): Promise<Users> {
    return this.prisma.users.update({
      where: {
        id
      },
      data: {
        ...user
      }
    });
  }

  async createUser(user: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data: user
    });
  }
}
