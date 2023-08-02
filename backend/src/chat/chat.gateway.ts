import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Config, { Env } from '../config/configuration';
import { SocketData } from './types';
import { connected } from 'process';

function webSocketOptions() {
  const config = Config();
  const options = {};
  if (config.env === Env.Dev) {
    return {
      cors: {
        origin: 'http://localhost:5173',
        transports: ['websocket', 'polling']
      },
      ...options
    };
  }
  return options;
}

@WebSocketGateway(Config().port, webSocketOptions())
export default class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.io.use((socket: SocketData, next) => {
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.username = username;
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: SocketData, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id:${socket.id} connected`);
    this.logger.log(`Nb clients: ${sockets.size}`);

    const users: { userID: string; username: string }[] = [];
    this.io.of('/').sockets.forEach((s: SocketData, id: string) => {
      users.push({
        userID: id,
        username: s.username
      });
    });
    this.io.emit('users', users);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }
}
