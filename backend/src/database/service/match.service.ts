import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private prisma: PrismaService) {}

  async addMatchHistory(id: string, match: string) {
    try {
      const user = await this.prisma.users.findUnique({
        include: {
          match: true
        },
        where: {
          id
        }
      });

      if (!user) return null;
      const [resultOfMatch, opId, currentTimestamp] = match.split('|');

      let max = 0;
      let oldestTimestamp = parseInt(currentTimestamp, 10);
      if (user.match.length >= 10) {
        for (let i = 0; i < user.match.length; i += 1) {
          const checkTimestamp = user.match[i].timestamp;
          if (oldestTimestamp > checkTimestamp) {
            max = i;
            oldestTimestamp = checkTimestamp;
          }
        }

        return await this.prisma.users.update({
          include: {
            match: true
          },
          where: {
            id
          },
          data: {
            match: {
              update: {
                where: {
                  id: user.match[max].id
                },
                data: {
                  result: parseInt(resultOfMatch, 10),
                  timestamp: parseInt(currentTimestamp, 10),
                  oppId: opId
                }
              }
            }
          }
        });
      }
      return await this.prisma.users.update({
        where: {
          id
        },
        include: {
          match: true
        },
        data: {
          match: {
            create: {
              result: parseInt(resultOfMatch, 10),
              timestamp: parseInt(currentTimestamp, 10),
              oppId: opId
            }
          }
        }
      });
    } catch (e: any) {
      return null;
    }
  }
}
