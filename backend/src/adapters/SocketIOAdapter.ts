import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthService } from 'src/auth/auth.service';
import { ChatSocket } from 'src/chat/chat.interface';

const createTokenMiddleware =
  (authService: AuthService, logger: Logger) =>
  async (socket: ChatSocket, next: (err?: ExtendedError) => void) => {
    const { token } = socket.handshake.auth;
    logger.debug(`Validating auth token before connection: ${token}`);

    const user = await authService.findUserWithJWT(token);
    if (user) {
      socket.userID = user.id;
      socket.username = user.username;
      socket.connected = true;
      next();
    } else {
      next(new Error('FORBIDDEN'));
    }
  };

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService = new ConfigService()
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = this.configService.get<string>('CLIENT_PORT');

    const cors = {
      origin: [`http://localhost:${clientPort}`]
    };

    this.logger.log(
      `Configuring socketIO server with custom CORS options ${cors.origin}`
    );

    const optionWithCORS: Partial<ServerOptions> = {
      ...options,
      cors
    };

    const authService = this.app.get(AuthService);

    const io: Server = super.createIOServer(port, optionWithCORS);
    io.use(createTokenMiddleware(authService, this.logger));

    return io;
  }
}
