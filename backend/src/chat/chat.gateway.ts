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
import {
  ChatSocket,
  PublicChatMessage,
  PublicChatUser
} from './chat.interface';
import { PrivateMessageDto } from './dto/MessageDto.dto';
import { ChatFilter } from './filters/chat.filter';
import InMemoryMessageStoreService from './message-store/services/in-memory-message-store.service';
import { UsersService } from '../database/service/users.service';

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
    private messageStore: InMemoryMessageStoreService,
    private usersService: UsersService
  ) {}

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.io.use(async (socket: ChatSocket, next) => {
      this.logger.debug(socket.user);
      return next();
    });
    this.logger.log('Initialized');
  }

  async handleConnection(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    socket.join(socket.user.id!);
    this.logger.debug(socket.user);
    const { sentMessages, receivedMessages } = socket.user;
    socket.emit('users', users);

    socket.broadcast.emit('user connected', {
      userID: socket.user.id,
      username: socket.user.username
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} disconnected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    const matchingSockets = await this.io.in(socket.user.id!).fetchSockets();

    if (matchingSockets.length === 0) {
      socket.broadcast.emit('user disconnected', socket.user.id);
    }
  }

  @SubscribeMessage('private message')
  @UseFilters(ChatFilter)
  handlePrivateMessage(
    @MessageBody(new ValidationPipe()) messageDto: PrivateMessageDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { to, content } = messageDto;
    this.logger.log(
      `Incoming private message from ${socket.user.id} to ${to} with content: ${content}`
    );
    const message = {
      content,
      from: socket.user.id!,
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
