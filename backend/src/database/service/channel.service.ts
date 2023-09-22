import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UUID } from '../../utils/types';

@Injectable()
export class ChannelService {
  private logger = new Logger(ChannelService.name);

  constructor(private prisma: PrismaService) {}

  async createChannel(channel: Prisma.ChannelCreateInput) {
    try {
      return await this.prisma.channel.create({
        data: channel
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

  async getDeepChanByName(displayName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          displayName
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

  async updateMembers(id: UUID, memberId: UUID) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          members: {
            push: memberId
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }
}
