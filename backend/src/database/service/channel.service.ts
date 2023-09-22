import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UUID } from '../../utils/types';

@Injectable()
export class ChannelService {
  private logger = new Logger(ChannelService.name);

  constructor(private prisma: PrismaService) {}

  async createChannel(channel: Prisma.ChannelCreateInput) {
    const { displayName, type, creatorId, admins, password } = channel;
    try {
      return await this.prisma.channel.create({
        data: {
          displayName,
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

  async getChanById(id: UUID) {
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

  async getDeepChanByName(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
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

  async getChanWithMessages(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
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

  async getChanWithMessagesAndMembers(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
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

  async getChanByName(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMembers(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
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

  async updateChannelMembers(chanId: UUID, memberId: UUID) {
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

  async deleteChannelByName(displayName: string) {
    try {
      return await this.prisma.channel.delete({
        where: {
          displayName
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }
}
