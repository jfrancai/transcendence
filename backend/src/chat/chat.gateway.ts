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
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelService } from '../database/service/channel.service';
import { JoinChannelDto } from './dto/join-channel.dto';
import { JoinChannelGuard } from './guards/join-channel.guard';
import { CONST_SALT } from '../auth/constants';
import { CreateChannelGuard } from './guards/create-channel.guard';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { DeleteChannelGuard } from './guards/delete-channel.guard';
import { ChannelMessageGuard } from './guards/channel-message.guard';
import { LeaveChannelDto } from './dto/leave-channel.dto';
import { LeaveChannelGuard } from './guards/leave-channel.guard';
import { AdminChannelDto } from './dto/admin-channel.dto';

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

    const messagesPerUser = new Map<string, PublicChatMessage[]>();
    const messages = await this.messageService.getMessageByUserId(
      socket.user.id!
    );
    const privateUsers = await this.usersService.getAllUsers();

    const mapUserIdUsername = new Map<string, string>();
    if (privateUsers) {
      privateUsers.forEach((user) => {
        mapUserIdUsername.set(user.id as string, user.username);
      });
    }

    messages!.forEach((message) => {
      const otherUser =
        socket.user.id === message.senderId
          ? message.receiverId
          : message.senderId;
      const sender = mapUserIdUsername.get(message.senderId as string);
      const receiver = mapUserIdUsername.get(message.receiverId as string);
      const publicMessage: PublicChatMessage = {
        content: message.content,
        sender: sender!,
        receiver: receiver!,
        id: message.id as string,
        createdAt: message.createdAt
      };
      if (messagesPerUser.has(otherUser as string)) {
        messagesPerUser.get(otherUser as string)?.push(publicMessage);
      } else {
        messagesPerUser.set(otherUser as string, [publicMessage]);
      }
    });

    const publicUsers: PublicChatUser[] = [];
    if (privateUsers) {
      privateUsers!.forEach((user) => {
        publicUsers.push({
          userID: user.id as string,
          connected: user.connectedChat,
          username: user.username!,
          messages: messagesPerUser.get(user.id as string) || []
        });
      });
    }
    socket.emit('users', publicUsers);

    const pubChan: { id: string; displayName: string }[] = [];
    const { channels } = socket.user;
    if (channels) {
      channels.forEach((channel) => {
        pubChan.push({
          id: channel.id!,
          displayName: channel.displayName!
        });
        socket.join(channel.id!);
      });
    }

    socket.emit('session', {
      userID: socket.user.id,
      channels: pubChan
    });

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
    socket.leave(deletedChan!.id);
    this.io.to(socket.user.id!).emit('leave channel', {
      displayName: deletedChan!.displayName,
      chanID: deletedChan!.id
    });
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
      await this.channelService.addChannelMember(
        channel.id as string,
        socket.user.id!
      );
      const pubMembers: Partial<PublicChatUser>[] = channel.members.map(
        (m) => ({
          userID: m.id as string,
          connected: m.connectedChat,
          username: m.username
        })
      );
      const pubMessages: PublicChatMessage[] = channel.messages.map((m) => ({
        id: m.id as string,
        content: m.content,
        sender: m.senderId as string,
        receiver: m.receiverId as string,
        createdAt: m.createdAt
      }));
      const pubChannel: PublicChannel = {
        id: channel.id as string,
        displayName: channel.displayName,
        messages: pubMessages,
        members: pubMembers
      };
      socket.join(displayName);
      this.io.to(socket.user.id!).emit('join channel', pubChannel);
      this.io.to(channel.id).emit('channel user', {
        id: channel.id as string,
        displayName: channel.displayName,
        userID: socket.user.id!
      });
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

    this.io.to(receiverId).to(senderId).emit('channel message', message);
  }

  @UseGuards(LeaveChannelGuard)
  @SubscribeMessage('leave channel')
  async handleLeaveChannel(
    @MessageBody() leaveChannelDto: LeaveChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { displayName } = leaveChannelDto;
    const senderId = socket.user.id!;
    this.logger.log(`User ${senderId} leave channel [${displayName}]`);
    const channel = await this.channelService.getChanWithMembers(displayName);
    if (channel) {
      const admins = channel.admins.filter((a) => a !== senderId);
      this.channelService.removeChannelMember(channel.id, senderId, admins);
      socket.leave(channel.id);
      this.io.to(channel.id).to(senderId).emit('leave channel', {
        message: 'User leaves channel',
        userID: senderId
      });
    }
  }

  async handleAdminChannel(
    @MessageBody() adminChannelDto: AdminChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {}
}
