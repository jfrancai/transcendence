import { Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChanInviteService {
  private logger = new Logger(ChanInviteService.name);

  constructor(private prisma: PrismaService) {}

  async getChanInviteById(id: string) {
    try {
      return await this.prisma.chanInvite.findUnique({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteChanInviteById(id: string) {
    try {
      return await this.prisma.chanInvite.delete({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async createChanInvite(invite: Prisma.ChanInviteCreateInput) {
    try {
      return await this.prisma.chanInvite.create({
        data: invite
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
