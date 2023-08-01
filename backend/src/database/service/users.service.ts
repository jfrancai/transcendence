import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import IPUsers from './interface/partial.users';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    try {
      return await this.prisma.users.findUnique({
        where: {
          id
        }
      });
    } catch (e: any) {
      return null;
    }
  }

  async getUser(user: IPUsers) {
    try {
      let ret = null;
      if (user.username !== undefined && user.email !== undefined) {
        ret = this.prisma.users.findUnique({
          where: {
            username: user.username,
            email: user.email
          }
        });
      } else if (user.email !== undefined) {
        ret = this.prisma.users.findUnique({
          where: {
            email: user.email
          }
        });
      } else if (user.username !== undefined) {
        ret = this.prisma.users.findUnique({
          where: {
            username: user.username
          }
        });
      }
      return await ret;
    } catch (e: any) {
      return null;
    }
  }

  async deleteUserById(id: number) {
    try {
      return await this.prisma.users.delete({
        where: {
          id
        }
      });
    } catch (e: any) {
      return null;
    }
  }

  async deleteUser(user: IPUsers) {
    try {
      let ret = null;
      if (user.username !== undefined && user.email !== undefined) {
        ret = this.prisma.users.delete({
          where: {
            username: user.username,
            email: user.email
          }
        });
      } else if (user.username !== undefined) {
        ret = this.prisma.users.delete({
          where: {
            username: user.username
          }
        });
      } else if (user.email !== undefined) {
        ret = this.prisma.users.delete({
          where: {
            email: user.email
          }
        });
      }
      return await ret;
    } catch (e: any) {
      return null;
    }
  }

  async updateUserById(id: number, user: Prisma.UsersUpdateInput) {
    try {
      return await this.prisma.users.update({
        where: {
          id
        },
        data: {
          ...user
        }
      });
    } catch (e: any) {
      return null;
    }
  }

  async updateUser(user: IPUsers, updateUser: Prisma.UsersUpdateInput) {
    try {
      let ret = null;
      if (user.username !== undefined && user.email !== undefined) {
        ret = this.prisma.users.update({
          where: {
            username: user.username,
            email: user.email
          },
          data: {
            ...updateUser
          }
        });
      } else if (user.username !== undefined) {
        ret = this.prisma.users.update({
          where: {
            username: user.username
          },
          data: {
            ...updateUser
          }
        });
      } else if (user.email !== undefined) {
        ret = this.prisma.users.update({
          where: {
            email: user.email
          },
          data: {
            ...updateUser
          }
        });
      }
      return await ret;
    } catch (e: any) {
      return null;
    }
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
