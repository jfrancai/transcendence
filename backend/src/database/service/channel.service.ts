import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

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
}
