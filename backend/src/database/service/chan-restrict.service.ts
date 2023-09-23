import { Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChanRestrictService {
  private logger = new Logger(ChanRestrictService.name);

  constructor(private prisma: PrismaService) {}

  async getChanRestrictById(id: string) {
    try {
      return await this.prisma.chanRestrict.findUnique({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteChanRestrictById(id: string) {
    try {
      return await this.prisma.chanRestrict.delete({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async createChanRestrict(restrict: Prisma.ChanRestrictCreateInput) {
    try {
      return await this.prisma.chanRestrict.create({
        data: restrict
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
