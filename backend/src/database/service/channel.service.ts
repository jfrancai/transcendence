import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ChannelType, Prisma } from '@prisma/client';
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

  async updateChanType(id: string, type: ChannelType, password?: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          type,
          password
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
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

  async getChanWithInviteList(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          inviteList: true,
          restrictList: true
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

  async addChannelMember(chanName: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          chanName
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

  async removeChannelMember(chanName: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          chanName
        },
        data: {
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

  async updateAdmins(chanName: string, admins: string[]) {
    try {
      return await this.prisma.channel.update({
        where: {
          chanName
        },
        data: {
          admins
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
