import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ChatSocket } from '../chat/chat.interface';
import { IUsers } from '../database/service/interface/users';

// Each WebSocketGateway is instantiated from this custom
// IoAdapter, which do two things for now : config cors
// policy and preventing websocket connection from forbidden
// client (checking jwt with AuthModule)

// This protection is only for client to connect to a ws gateway
// custom event (~= http routes) are not protected by default you
// stil have to add some guard if you want to restrict access to certain
// event to certain clients (or use namespace)

const createTokenMiddleware =
  (authService: AuthService, logger: Logger) =>
  async (socket: ChatSocket, next: (err?: ExtendedError) => void) => {
    const { token } = socket.handshake.auth;
    logger.log(`Validating auth token before connection: ${token}`);

    const user = await authService.findUserByJWT(token);
    if (user) {
      socket.user = user as Partial<IUsers>;
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

    const authService = this.app.select(AuthModule).get(AuthService);

    // Here we create the Socket.io server
    const io: Server = super.createIOServer(port, optionWithCORS);
    // And we attach some middleware to it, this middleware
    // check for valid jwt inside client first payload
    io.use(createTokenMiddleware(authService, this.logger));

    return io;
  }
}
