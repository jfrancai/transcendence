import { Injectable, Logger } from '@nestjs/common';
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
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
