import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger();

  constructor(
    private app: INestApplication,
    private configService: ConfigService
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const clientPort = parseInt(this.configService);
    const cors = {
      origin: `http://localhost:${clientPort}`
    };
  }
}
