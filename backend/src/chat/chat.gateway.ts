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
import { PrivateMessageDto } from './dto/PrivateMessage.dto';
import { ChatFilter } from './filters/chat.filter';
import { MessageService } from '../database/service/message.service';
import { UsersService } from '../database/service/users.service';
import { UUID } from '../utils/types';
import { ChannelDto } from './dto/Channel.dto';
import { ChannelService } from '../database/service/channel.service';

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
    private messageService: MessageService,
    private channelService: ChannelService
  ) {}

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    this.usersService.setChatConnected(socket.user.id!);

    socket.join(socket.user.id!);

    const messagesPerUser = new Map<UUID, PublicChatMessage[]>();
    const messages = await this.messageService.getMessageByUserId(
      socket.user.id!
    );
    const privateUsers = await this.usersService.getAllUsers();

    const mapUserIdUsername = new Map<UUID, string>();
    if (privateUsers) {
      privateUsers.forEach((user) => {
        mapUserIdUsername.set(user.id as UUID, user.username);
      });
    }

    messages!.forEach((message) => {
      const otherUser =
        socket.user.id === message.senderId
          ? message.receiverId
          : message.senderId;
      const sender = mapUserIdUsername.get(message.senderId as UUID);
      const receiver = mapUserIdUsername.get(message.receiverId as UUID);
      const publicMessage: PublicChatMessage = {
        content: message.content,
        sender: sender!,
        receiver: receiver!,
        id: message.id as UUID,
        createdAt: message.createdAt
      };
      if (messagesPerUser.has(otherUser as UUID)) {
        messagesPerUser.get(otherUser as UUID)?.push(publicMessage);
      } else {
        messagesPerUser.set(otherUser as UUID, [publicMessage]);
      }
    });

    const publicUsers: PublicChatUser[] = [];
    if (privateUsers) {
      privateUsers!.forEach((user) => {
        publicUsers.push({
          userID: user.id as UUID,
          connected: user.connectedChat,
          username: user.username!,
          messages: messagesPerUser.get(user.id as UUID) || []
        });
      });
    }
    socket.emit('session', {
      userID: socket.user.id
    });
    socket.emit('users', publicUsers);

    socket.broadcast.emit('user connected', {
      userID: socket.user.id,
      username: socket.user.username
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    this.logger.log(`ClientId: ${socket.user.id} disconnected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    this.usersService.setChatDisonnected(socket.user.id!);

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
    const { receiverId, content } = messageDto;
    const senderId = socket.user.id!;
    this.logger.log(
      `Incoming private message from ${senderId} to ${receiverId} with content: ${content}`
    );
    const message = await this.messageService.createMessage({
      content,
      senderId,
      receiverId
    });

    if (message) {
      this.io
        .to(receiverId)
        .to(socket.user.id!)
        .emit('private message', message);
    }
  }

  @SubscribeMessage('create channel')
  @UseFilters(ChatFilter)
  async handleCreateChannel(
    @MessageBody(new ValidationPipe()) channelDto: ChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { displayName, type } = channelDto;
    const creatorId = socket.user.id!;
    this.logger.log(
      `Channel creation request from ${creatorId}: [displayName: ${displayName}] [type: ${type}]`
    );

    const channel = await this.channelService.createChannel({
      displayName,
      type,
      creatorId,
      admins: [creatorId]
    });
  }
}
