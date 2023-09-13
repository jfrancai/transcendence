import { v4 as uuidv4 } from 'uuid';
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
import { Logger, UseFilters, ValidationPipe } from '@nestjs/common';
import { Session } from './session-store/session-store.interface';
import InMemorySessionStoreService from './session-store/in-memory-session-store/in-memory-session-store.service';
import { ChatSocket } from './chat.interface';
import InMemoryMessageStoreService from './message-store/in-memory-message-store/in-memory-message-store.service';
import { MessageDto } from './dto/MessageDto.dto';
import { ChatFilter } from './filters/chat.filter';

@WebSocketGateway()
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
      const { userID } = socket.handshake.auth;
      if (userID) {
        const session = this.sessionStore.findSession(userID);
        if (session) {
          return next();
        }
      }
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      this.sessionStore.saveSession(socket.userID, {
        userID: socket.userID,
        username,
        connected: true,
        messages: []
      });
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.userID} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const messagesPerUser = new Map();
    const allMessages = this.messageStore.findMessageForUser(socket.userID);
    allMessages.forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });
    socket.join(socket.userID);
    const users: Session[] = [];
    this.sessionStore.findAllSession().forEach((session: Session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || []
      });
    });
    socket.emit('session', {
      userID: socket.userID,
      username: socket.username
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.userID,
      username: socket.username,
      connected: this.sessionStore.findSession(socket.userID)
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.userID} disconnected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const matchingSockets = await this.io.in(socket.userID).fetchSockets();

    if (matchingSockets.length === 0) {
      socket.broadcast.emit('user disconnected', socket.userID);
      const session = this.sessionStore.findSession(socket.userID);
      if (session) {
        session.connected = false;
      }
    }
  }

  @SubscribeMessage('private message')
  @UseFilters(ChatFilter)
  handlePrivateMessage(
    @MessageBody(new ValidationPipe()) messageDto: MessageDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { to, content } = messageDto;
    this.logger.log(
      `Incoming private message from ${socket.userID} to ${to} with content: ${content}`
    );
    const message = {
      content,
      from: socket.userID,
      messageID: ChatGateway.randomId(),
      date: new Date(),
      to
    };
    this.io.to(to).to(socket.userID).emit('private message', message);
    this.messageStore.saveMessage(message);
  }

  static randomId(): string {
    return uuidv4();
  }
}
