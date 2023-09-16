import { Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UUID } from '../../utils/types';

@Injectable()
export class MessageService {
  private logger = new Logger(MessageService.name);

  constructor(private prisma: PrismaService) {}

  async getMessageById(id: UUID) {
    try {
      return await this.prisma.message.findUnique({
        where: {
          id
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async createMessage(message: Prisma.MessageCreateInput) {
    try {
      return await this.prisma.message.create({
        data: message
      });
    } catch (error: any) {
      this.logger.warn(error);
      return null;
    }
  }
}
