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
import { MessageService } from '../database/service/message.service';
import { UsersService } from '../database/service/users.service';
import { UUID } from '../utils/types';
import { IUsers } from 'src/database/service/interface/users';

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
    private usersService: UsersService,
    private messageService: MessageService
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

    const messagesPerUser = new Map<UUID, PublicChatMessage[]>();
    const messages = await this.messageService.getMessageByUserId(
      socket.user.id!
    );
    messages!.forEach(async (message) => {
      const otherUser =
        socket.user.id === message.senderId
          ? message.receiverId
          : message.senderId;
      const sender = await this.usersService.getUserById(message.senderId);
      const receiver = await this.usersService.getUserById(message.receiverId);
      const publicMessage: PublicChatMessage = {
        content: message.content,
        sender: sender!.username,
        receiver: receiver!.username
      };
      if (messagesPerUser.has(otherUser as UUID)) {
        messagesPerUser.get(otherUser as UUID)?.push(publicMessage);
      } else {
        messagesPerUser.set(otherUser as UUID, [publicMessage]);
      }
    });

    const publicUsers: PublicChatUser[] = [];
    const privateUsers = await this.usersService.getAllUsers();
    if (privateUsers) {
      privateUsers!.forEach((user) => {
        publicUsers.push({
          userID: user.id as UUID,
          username: user.username!,
          messages: messagesPerUser.get(user.id as UUID) || []
        });
      });
    }
    this.logger.debug(`users ${publicUsers}`);
    socket.emit('users', publicUsers);

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
  async handlePrivateMessage(
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
