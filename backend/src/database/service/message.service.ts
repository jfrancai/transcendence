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

  async getMessageByUserId(id: UUID) {
    try {
      return await this.prisma.message.findMany({
        orderBy: [
          {
            createdAt: 'asc'
          }
        ],
        where: {
          OR: [
            {
              senderId: {
                equals: id
              }
            },
            {
              receiverId: {
                equals: id
              }
            }
          ]
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
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async createChannelMessage(message: Prisma.MessageCreateInput) {
    try {
      return await this.prisma.message.create({
        data: {
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId,
          channel: {
            connect: { id: message.receiverId }
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
