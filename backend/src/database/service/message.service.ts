import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MessageService {
  private logger = new Logger(MessageService.name);

  constructor(private prisma: PrismaService) {}

  async getMessageById(id: string) {
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

  async getMessageByUserId(id: string) {
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
              senderID: {
                equals: id
              }
            },
            {
              receiverID: {
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

  async createMessage(message: {
    content: string;
    senderID: string;
    receiverID: string;
  }) {
    try {
      return await this.prisma.message.create({
        data: {
          content: message.content,
          sender: {
            connect: { id: message.senderID }
          },
          receiver: {
            connect: { id: message.receiverID }
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async createChannelMessage(message: {
    content: string;
    senderID: string;
    receiverID: string;
  }) {
    try {
      return await this.prisma.message.create({
        data: {
          content: message.content,
          sender: {
            connect: { id: message.senderID }
          },
          receiver: {
            connect: { id: message.receiverID }
          },
          channel: {
            connect: { id: message.receiverID }
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
