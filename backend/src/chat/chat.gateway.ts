import * as bcrypt from 'bcrypt';
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
import { Logger, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ChatSocket,
  PublicChannel,
  PublicChatMessage,
  PublicChatUser
} from './chat.interface';
import { PrivateMessageDto } from './dto/private-message.dto';
import { ChatFilter } from './filters/chat.filter';
import { MessageService } from '../database/service/message.service';
import { UsersService } from '../database/service/users.service';
import { UUID } from '../utils/types';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelService } from '../database/service/channel.service';
import { JoinChannelDto } from './dto/join-channel.dto';
import { JoinChannelGuard } from './guards/join-channel.guard';
import { CONST_SALT } from '../auth/constants';
import { CreateChannelGuard } from './guards/create-channel.guard';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { DeleteChannelGuard } from './guards/delete-channel.guard';
import { ChannelMessageGuard } from './guards/channel-message.guard';

// WebSocketGateways are instantiated from the SocketIoAdapter (inside src/adapters)
// inside this IoAdapter there is authentification process with JWT
// validation using the AuthModule. Be aware of this in case you are
// stuck not understanding what is happenning.

@UseFilters(ChatFilter)
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

  async afterInit() {
    // /!\ To remove test only /!\
    await this.usersService.createUser({
      id: 'ffa03160-6419-4e52-8879-f99e90eeca35',
      email: 'jfrancai@student.42.fr',
      username: 'jfrancai',
      password: 'toto',
      twoAuthOn: false,
      twoAuthSecret: 'toto',
      apiToken: 'toto',
      connectedChat: false
    });

    await this.usersService.createUser({
      id: '693e8fcf-915b-472d-beee-ed53fec63008',
      email: 'toto@student.42.fr',
      username: 'toto',
      password: 'toto',
      twoAuthOn: false,
      twoAuthSecret: 'toto',
      apiToken: 'toto',
      connectedChat: false
    });

    await this.usersService.createUser({
      id: '673e8fcf-915b-472d-beee-ed53fec63008',
      email: 'tata@student.42.fr',
      username: 'tata',
      password: 'tata',
      twoAuthOn: false,
      twoAuthSecret: 'tata',
      apiToken: 'tata',
      connectedChat: false
    });
    // /!\ To remove test only /!\
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

    this.io.to(receiverId).to(socket.user.id!).emit('private message', message);
  }

  @UseGuards(CreateChannelGuard)
  @SubscribeMessage('create channel')
  async handleCreateChannel(
    @MessageBody() channelDto: CreateChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { displayName, type, password } = channelDto;
    const creatorId = socket.user.id!;
    this.logger.log(
      `Channel creation request from ${creatorId}: [displayName: ${displayName}] [type: ${type}]`
    );
    const chanDetail = {
      displayName,
      type,
      creatorId,
      admins: [creatorId],
      password: ''
    };
    if (password) {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const passwordHash = await bcrypt.hash(password, salt);
      chanDetail.password = passwordHash;
    }
    const privChan = await this.channelService.createChannel(chanDetail);
    const pubChan = {
      id: privChan.id,
      type: privChan.type,
      displayName: privChan.displayName,
      createdAt: privChan.createdAt
    };
    socket.join(privChan.id);
    this.io.to(socket.user.id!).emit('create channel', pubChan);
  }

  @UseGuards(DeleteChannelGuard)
  @SubscribeMessage('delete channel')
  async handleDeleteChannel(
    @MessageBody() deleteChannelDto: DeleteChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { displayName } = deleteChannelDto;
    const clientId = socket.user.id!;
    this.logger.log(`Client ${clientId} request to delete chan ${displayName}`);

    const deletedChan = await this.channelService.deleteChannelByName(
      displayName
    );
    this.io.to(socket.user.id!).emit('delete channel', {
      message: 'Channel deleted',
      chanID: deletedChan!.id
    });
  }

  @UseGuards(JoinChannelGuard)
  @SubscribeMessage('join channel')
  async handleJoinChannel(
    @MessageBody() joinChannelDto: JoinChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { displayName } = joinChannelDto;
    const clientId = socket.user.id!;
    this.logger.log(`ClientId ${clientId} request to join chan ${displayName}`);
    const channel = await this.channelService.getChanWithMessagesAndMembers(
      displayName
    );
    if (channel) {
      await this.channelService.updateChannelMembers(
        channel.id as UUID,
        socket.user.id!
      );
      const pubMembers: Partial<PublicChatUser>[] = channel.members.map(
        (m) => ({
          userID: m.id as UUID,
          connected: m.connectedChat,
          username: m.username
        })
      );
      const pubMessages: PublicChatMessage[] = channel.messages.map((m) => ({
        id: m.id as UUID,
        content: m.content,
        sender: m.senderId as UUID,
        receiver: m.receiverId as UUID,
        createdAt: m.createdAt
      }));
      const pubChannel: PublicChannel = {
        id: channel.id as UUID,
        displayName: channel.displayName,
        userID: socket.user.id!,
        messages: pubMessages,
        members: pubMembers
      };
      socket.join(displayName);
      this.io
        .to(channel.id)
        .to(socket.user.id!)
        .emit('join channel', pubChannel);
    }
  }

  @UseGuards(ChannelMessageGuard)
  @SubscribeMessage('channel message')
  async handleChannelMessage(
    @MessageBody() messageDto: PrivateMessageDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { receiverId, content } = messageDto;
    const senderId = socket.user.id!;
    this.logger.log(
      `Incoming channel message from ${senderId} to ${receiverId} with content: ${content}`
    );
    const message = await this.messageService.createChannelMessage({
      content,
      senderId,
      receiverId
    });

    this.io.to(receiverId).to(socket.user.id!).emit('channel message', message);
  }
}
