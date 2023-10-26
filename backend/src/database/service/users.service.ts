import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { IUsers } from './interface/users';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    try {
      return await this.prisma.users.findUnique({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async getAllUsers() {
    try {
      return await this.prisma.users.findMany();
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async getFullUserWithEmail(email: string) {
    try {
      return await this.prisma.users.findUnique({
        where: {
          email
        },
        include: {
          channels: true
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async getUserByIdWithChan(id: string) {
    try {
      return await this.prisma.users.findUnique({
        where: {
          id
        },
        include: {
          channels: true
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async getUser(user: Partial<IUsers>) {
    try {
      if (user.username !== undefined && user.email !== undefined) {
        return await this.prisma.users.findUnique({
          where: {
            username: user.username,
            email: user.email
          }
        });
      }
      if (user.email !== undefined) {
        return await this.prisma.users.findUnique({
          where: {
            email: user.email
          }
        });
      }
      if (user.username !== undefined) {
        return await this.prisma.users.findUnique({
          where: {
            username: user.username
          }
        });
      }
      return null;
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteUserById(id: string) {
    try {
      return await this.prisma.users.delete({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteUser(user: Partial<IUsers>) {
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
      this.logger.warn(e);
      return null;
    }
  }

  async updateUserById(id: string, user: Prisma.UsersUpdateInput) {
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
      this.logger.warn(e);
      return null;
    }
  }

  async updateUser(user: Partial<IUsers>, updateUser: Prisma.UsersUpdateInput) {
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
      this.logger.warn(e);
      return null;
    }
  }

  async createUser(user: Prisma.UsersCreateInput) {
    try {
      return await this.prisma.users.create({
        data: user
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async setChatConnected(id: string) {
    try {
      return await this.prisma.users.update({
        where: {
          id
        },
        data: {
          connectedChat: {
            set: true
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async setChatDisonnected(id: string) {
    try {
      return await this.prisma.users.update({
        where: {
          id
        },
        data: {
          connectedChat: {
            set: false
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async addMatchHistory(id: string, match: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id
        }
      });

      if (!user) return null;

      let max = 0;
      let [_rsM, _opId, oldestTimestamp] = match.split('|'); // eslint-disable-line

      if (user.matchHistory.length >= 10) {
        for (let i: number = 0; i < user.matchHistory.length; i += 1) {
          // eslint-disable-next-line
          const [_resultOfMatch, _opponentId, timestamp] =
            user.matchHistory[i].split('|');

          if (oldestTimestamp > timestamp) {
            oldestTimestamp = timestamp;
            max = i;
          }
        }

        user.matchHistory[max] = match;
      } else {
        user.matchHistory.push(match);
      }

      return await this.prisma.users.update({
        where: {
          id
        },
        data: {
          matchHistory: user.matchHistory
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
