import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChannelService {
  private logger = new Logger(ChannelService.name);

  constructor(private prisma: PrismaService) {}

  async createChannel(channel: Prisma.ChannelCreateInput) {
    const { chanName, type, creatorId, admins, password } = channel;
    try {
      return await this.prisma.channel.create({
        data: {
          chanName,
          type,
          creatorId,
          admins,
          password,
          members: {
            connect: {
              id: creatorId
            }
          }
        }
      });
    } catch (e) {
      if (e.name === 'PrismaClientKnownRequestError') {
        throw new ForbiddenException('Channel name must be unique');
      }
      throw new ForbiddenException('Channel creation forbiden');
    }
  }

  async getChanById(id: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          id
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getDeepChanByName(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          inviteList: true,
          restrictList: true,
          members: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithRestrictList(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          restrictList: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMessages(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          messages: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMessagesAndMembers(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          messages: true,
          members: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanByName(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMembers(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          members: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async addChannelMember(chanId: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id: chanId
        },
        data: {
          members: {
            connect: { id: memberId }
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async removeChannelMember(
    chanId: string,
    memberId: string,
    admins: string[]
  ) {
    try {
      return await this.prisma.channel.update({
        where: {
          id: chanId
        },
        data: {
          admins,
          members: {
            disconnect: { id: memberId }
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async addAdmin(chanName: string, adminId: string) {
    const channel = await this.getChanByName(chanName);
    if (channel === null) {
      return null;
    }
    try {
      return await this.prisma.channel.update({
        where: {
          chanName
        },
        data: {
          admins: [...channel.admins, adminId]
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteChannelByName(chanName: string) {
    try {
      return await this.prisma.channel.delete({
        where: {
          chanName
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }
}
