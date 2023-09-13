import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = this.configService.get<string>('CLIENT_PORT');
    this.logger.debug('Client port here : ', clientPort);

    const cors = {
      origin: [`http://localhost:${clientPort}`]
    };

    this.logger.log('Configuring socketIO server with custom CORS options');

    const optionWithCORS: Partial<ServerOptions> = {
      ...options,
      cors
    };

    return super.createIOServer(port, optionWithCORS);
  }
}
