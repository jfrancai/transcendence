import { Injectable } from '@nestjs/common';
import { Users, Prisma } from '@prisma/client';
import PrismaService from './prisma.service';

@Injectable()
export default class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.users.findUnique({
      where: {
        id
      }
    });
  }

  async getUser(username?: string, email?: string) {
    let ret = null;
    if (username !== undefined && email !== undefined) {
      ret = this.prisma.users.findUnique({
        where: {
          name: username,
          email
        }
      });
    } else if (email !== undefined) {
      ret = this.prisma.users.findUnique({
        where: {
          email
        }
      });
    } else if (username !== undefined) {
      ret = this.prisma.users.findUnique({
        where: {
          name: username
        }
      });
    }
    return ret;
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

  async createUser(user: Prisma.UsersCreateInput) {
    try {
      return await this.prisma.users.create({
        data: user
      });
    } catch (e: any) {
      return null;
    }
  }
}
