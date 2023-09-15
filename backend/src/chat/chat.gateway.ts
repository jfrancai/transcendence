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

// WebSocketGateways are instantiated from the SocketIoAdapter (inside src/adapters)
// inside this IoAdapter there is authentification process with JWT
// validation using the AuthModule. Be aware of this in case you are
// stuck not understanding what is happenning.

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
    this.io.use(async (socket: ChatSocket, next) => {
      this.logger.log(socket.user);
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const messagesPerUser = new Map();
    const allMessages = this.messageStore.findMessageForUser(socket.user.id);
    allMessages.forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.user.id === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });
    socket.join(socket.user.id!);
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
      userID: socket.user.id,
      username: socket.user.id
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.user.id,
      username: socket.user.username,
      connected: this.sessionStore.findSession(socket.user.id!)
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} disconnected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const matchingSockets = await this.io.in(socket.user.id!).fetchSockets();

    if (matchingSockets.length === 0) {
      socket.broadcast.emit('user disconnected', socket.user.id);
      const session = this.sessionStore.findSession(socket.user.id!);
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
      `Incoming private message from ${socket.user.id} to ${to} with content: ${content}`
    );
    const message = {
      content,
      from: socket.user.id,
      messageID: ChatGateway.randomId(),
      date: new Date(),
      to
    };
    this.io.to(to).to(socket.user.id!).emit('private message', message);
    this.messageStore.saveMessage(message);
  }

  static randomId(): string {
    return uuidv4();
  }
}
