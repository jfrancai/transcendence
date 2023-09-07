import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import Config, { Env } from '../config/configuration';
import { ChatSocket } from './chat.interface';
import ChatService from './chat.service';

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

@WebSocketGateway(parseInt(process.env.PORT! || '3001', 10), webSocketOptions())
export default class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private chatService = new ChatService();

  private readonly logger = new Logger(ChatGateway.name);

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.chatService.setIoServer(this.io);
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id:${socket.id} connected`);
    this.logger.log(`Nb clients: ${sockets.size}`);
    return this.chatService.handleConnection(socket, args);
  }

  handleDisconnect(socket: ChatSocket) {
    this.logger.log(`Client id:${socket.id} disconnected`);
  }

  @SubscribeMessage('private message')
  handlePrivateMessage(
    @MessageBody('to') to: string,
    @MessageBody('content') content: string,
    @ConnectedSocket() socket: ChatSocket
  ) {
    this.logger.log(
      `Incoming private message from ${to} with content: ${content}`
    );
    this.chatService.handlePrivateMessage(to, content, socket);
  }
}
