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
import { ChatSocket, PublicChatUser } from './chat.interface';
import { PrivateMessageDto } from './dto/MessageDto.dto';
import { ChatFilter } from './filters/chat.filter';
import { MessageService } from '../database/service/message.service';

// WebSocketGateways are instantiated from the SocketIoAdapter (inside src/adapters)
// inside this IoAdapter there is authentification process with JWT
// validation using the AuthModule. Be aware of this in case you are
// stuck not understanding what is happenning.

@WebSocketGateway()
export default class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private messageService: MessageService) {}

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

    const messagesPerUser = new Map();
    const messages = await this.messageService.getMessageByUserId(
      socket.user.id!
    );
    messages!.forEach((message) => {
      const from = message.senderId;
      const to = message.receiverId;
      const otherUser = socket.user.id === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    const users: PublicChatUser[] = [];

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
      senderId: socket.user.id!,
      receiverId: to
    };
    this.io.to(to).to(socket.user.id!).emit('private message', message);
    this.messageService.createMessage(message);
  }
}
