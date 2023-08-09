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
import { randomBytes } from 'crypto';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Session } from './session-store/session-store.interface';
import InMemorySessionStoreService from './session-store/in-memory-session-store/in-memory-session-store.service';
import Config, { Env } from '../config/configuration';
import { ChatSocket } from './chat.interface';
import InMemoryMessageStoreService from './message-store/in-memory-message-store/in-memory-message-store.service';

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

  constructor(
    private sessionStore: InMemorySessionStoreService<string, Session>,
    private messageStore: InMemoryMessageStoreService
  ) {}

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.io.use((socket: ChatSocket, next) => {
      const { sessionID } = socket.handshake.auth;
      if (sessionID) {
        const session = this.sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.sessionID = ChatGateway.randomId();
      socket.userID = ChatGateway.randomId();
      socket.username = username;
      this.sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username,
        connected: true,
        messages: []
      });
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    this.logger.log(`Client id:${socket.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const users: Session[] = [];
    const messagesPerUser = new Map();
    this.messageStore.findMessageForUser(socket.userID).forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    socket.join(socket.userID);
    this.sessionStore.findAllSession().forEach((session: Session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || []
      });
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.userID,
      username: socket.username
    });
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    this.logger.log(`Client id:${socket.id} disconnected`);
    const matchingSockets = await this.io.in(socket.userID).fetchSockets();

    if (matchingSockets.length === 0) {
      socket.broadcast.emit('user disconnected', socket.userID);
      const session = this.sessionStore.findSession(socket.sessionID);
      if (session) {
        session.connected = false;
      }
    }
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
    const message = {
      content,
      from: socket.userID,
      to
    };
    socket.to(to).to(socket.userID).emit('private message', message);
    this.messageStore.saveMessage(message);
  }

  static randomId(): string {
    return randomBytes(8).toString('hex');
  }
}
