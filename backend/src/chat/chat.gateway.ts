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
import {
  ForbiddenException,
  Logger,
  NotFoundException,
  UseFilters,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  ChatSocket,
  PublicChannel,
  PublicChannelMessage,
  PublicChatUser,
  PublicMessage
} from './chat.interface';
import { PrivateMessageDto } from './dto/private-message.dto';
import { ChatFilter } from './filters/chat.filter';
import { MessageService } from '../database/service/message.service';
import { UsersService } from '../database/service/users.service';
import { ChannelService } from '../database/service/channel.service';
import { JoinChannelGuard } from './guards/join-channel.guard';
import { CONST_SALT } from '../auth/constants';
import { EmptyChannelGuard } from './guards/delete-channel.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { ChannelDto } from './dto/channel.dto';
import { RestrictGuard } from './guards/restrict.guard';
import { Restrict } from './decorators/restricts.decorator';
import { ChannelNameDto } from './dto/channel-name.dto';
import { ChannelMessageDto } from './dto/channel-message.dto';
import { ChannelUsersDto } from './dto/channel-users.dto';
import { EmptyChannel } from './decorators/empty-channel';
import { ChannelRestrictDto } from './dto/channel-restrict.dto';
import { UserDto } from './dto/user.dto';
import { ChannelIdDto } from './dto/channel-id.dto';

// WebSocketGateways are instantiated from the SocketIoAdapter (inside src/adapters)
// inside this IoAdapter there is authentification process with JWT
// validation using the AuthModule. Be aware of this in case you are
// stuck not understanding what is happenning.

@UseFilters(ChatFilter)
@UseGuards(EmptyChannelGuard, RestrictGuard, RolesGuard)
@WebSocketGateway()
export default class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  private socketMap = new Map();

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
    const senderID = socket.user.id!;
    this.socketMap.set(senderID, socket);

    this.logger.log(`ClientId: ${socket.user.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    socket.join(socket.user.id!);
    const user = await this.usersService.getUserByIdWithChan(senderID);
    if (user) {
      user.channels.forEach((c) => socket.join(c.id));
    }

    this.usersService.setChatConnected(socket.user.id!);
    socket.broadcast.emit('userConnected', {
      userID: socket.user.id,
      username: socket.user.username
    });
  }

  async handleDisconnect(socket: ChatSocket) {
    const senderID = socket.user.id!;
    this.logger.log(`ClientId: ${senderID} disconnected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);

    this.usersService.setChatDisonnected(socket.user.id!);

    const matchingSockets = await this.io.in(socket.user.id!).fetchSockets();

    if (matchingSockets.length === 0) {
      socket.broadcast.emit('userDisconnected', {
        userID: socket.user.id,
        username: socket.user.username
      });
      this.socketMap.delete(senderID);
    }
  }

  @SubscribeMessage('session')
  async handleSession(@ConnectedSocket() socket: ChatSocket) {
    const senderID = socket.user.id!;
    const user = await this.usersService.getUserById(senderID);
    if (user) {
      socket.emit('session', {
        userID: user.id
      });
    }
  }

  @SubscribeMessage('messages')
  async handleMessages(
    @MessageBody(new ValidationPipe()) userDto: UserDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { userID } = userDto;
    const senderID = socket.user.id!;

    const allMessagesForUserId = await this.messageService.getMessageByUserId(
      senderID
    );
    const sender = await this.usersService.getUserById(senderID);
    const receiver = await this.usersService.getUserById(userID);
    if (allMessagesForUserId) {
      const messages: PublicMessage[] = allMessagesForUserId
        .filter((m) => m.senderID === userID || m.receiverID === userID)
        .map((m) => ({
          ...m,
          messageID: m.id,
          sender: sender!.username,
          receiver: receiver!.username
        }));
      socket.emit('messages', messages);
    }
  }

  @SubscribeMessage('users')
  async handleUsers(@ConnectedSocket() socket: ChatSocket) {
    const senderID = socket.user.id!;
    const user = await this.usersService.getUserById(senderID);
    const privateUsers = await this.usersService.getAllUsers();
    const publicUsers: PublicChatUser[] = [];
    if (privateUsers && user) {
      privateUsers
        .filter((u) => !user.blockList.includes(u.id))
        .forEach((u) => {
          publicUsers.push({
            userID: u.id,
            connected: u.connectedChat,
            username: u.username!
          });
        });
    }
    socket.emit('users', publicUsers);
  }

  @SubscribeMessage('usersBlocked')
  async handleUsersBlocked(@ConnectedSocket() socket: ChatSocket) {
    const senderID = socket.user.id!;
    const user = await this.usersService.getUserById(senderID);
    const privateUsers = await this.usersService.getAllUsers();
    const publicUsers: PublicChatUser[] = [];
    if (privateUsers && user) {
      privateUsers
        .filter((u) => user.blockList.includes(u.id))
        .forEach((u) => {
          publicUsers.push({
            userID: u.id,
            connected: u.connectedChat,
            username: u.username!
          });
        });
    }
    socket.emit('usersBlocked', publicUsers);
  }

  @SubscribeMessage('usersBanned')
  async handleUsersBanned(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    const channel = await this.channelService.getChanById(chanID);
    const privateUsers = await this.usersService.getAllUsers();
    if (channel && privateUsers) {
      const banMembers: PublicChatUser[] = privateUsers
        .filter((m) => channel.bans.includes(m.id))
        .map((m) => ({
          userID: m.id,
          connected: m.connectedChat,
          username: m.username!
        }));
      this.io.to(senderID).emit('usersBanned', banMembers);
    }
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(
    @MessageBody(new ValidationPipe()) userDto: UserDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { userID } = userDto;
    const senderID = socket.user.id!;
    const user = await this.usersService.getUserById(senderID);
    if (user && userID !== senderID) {
      const newBlocks = user.blockList.filter((id) => id !== userID);
      const blockSet = new Set(newBlocks);
      user.blockList = Array.from(blockSet);
      await this.usersService.updateUser({ username: user.username }, user);
      socket.emit('blockUser', {
        userID
      });
    }
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    @MessageBody(new ValidationPipe()) userDto: UserDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { userID } = userDto;
    const senderID = socket.user.id!;
    const user = await this.usersService.getUserById(senderID);
    if (user && userID !== senderID) {
      const newBlocks = user.blockList.concat(userID);
      const blockSet = new Set(newBlocks);
      user.blockList = Array.from(blockSet);
      await this.usersService.updateUser({ username: user.username }, user);
      socket.emit('blockUser', {
        userID
      });
    }
  }

  @SubscribeMessage('channels')
  async handleChannels(@ConnectedSocket() socket: ChatSocket) {
    const senderID = socket.user.id!;
    const privateUsers = await this.usersService.getUserByIdWithChan(senderID);
    const privateChannels = privateUsers?.channels;
    if (privateChannels) {
      const publicChannels: PublicChannel[] = [];
      privateChannels.forEach((c) => {
        publicChannels.push({
          chanID: c.id,
          chanAdmins: c.admins,
          creatorID: c.creatorID,
          chanName: c.chanName,
          chanType: c.type,
          chanCreatedAt: c.createdAt
        });
      });
      socket.emit('channels', publicChannels);
    }
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody(new ValidationPipe()) messageDto: PrivateMessageDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { userID, content } = messageDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Incoming private message from ${senderID} to ${userID} with content: ${content}`
    );
    const message = await this.messageService.createMessage({
      content,
      senderID,
      receiverID: userID
    });
    const sender = await this.usersService.getUserById(senderID);
    const receiver = await this.usersService.getUserById(userID);
    if (
      sender &&
      receiver &&
      !receiver.blockList.includes(sender.id) &&
      message &&
      message.receiverID
    ) {
      const publicMessage: PublicMessage = {
        content: message.content,
        sender: sender!.username,
        senderID: message.senderID,
        receiver: receiver!.username,
        receiverID: message.receiverID,
        messageID: message.id,
        createdAt: message.createdAt
      };

      this.io
        .to(userID)
        .to(socket.user.id!)
        .emit('privateMessage', publicMessage);
    }
  }

  @SubscribeMessage('channelCreate')
  async handleCreateChannel(
    @MessageBody(new ValidationPipe({ transform: true }))
    channelDto: ChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanName, type, password } = channelDto;
    const creatorID = socket.user.id!;
    this.logger.log(
      `Channel creation request from ${creatorID}: [chanName: ${chanName}] [type: ${type}]`
    );
    const privChan = {
      chanName,
      type,
      creatorID,
      admins: [creatorID],
      password
    };
    if (password) {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const passwordHash = await bcrypt.hash(password, salt);
      privChan.password = passwordHash;
    }
    const channel = await this.channelService.createChannel(privChan);
    const pubChan: PublicChannel = {
      chanID: channel.id,
      chanAdmins: channel.admins,
      creatorID: channel.creatorID,
      chanName: channel.chanName,
      chanType: channel.type,
      chanCreatedAt: channel.createdAt
    };
    socket.join(channel.id);
    this.io.to(creatorID).emit('channelCreate', pubChan);
  }

  @EmptyChannel()
  @Roles(['creator'])
  @SubscribeMessage('channelDelete')
  async handleDeleteChannel(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    this.logger.log(`Client ${senderID} request to delete chan ${chanID}`);

    await this.messageService.deleteMessageByChanId(chanID);
    const deletedChan = await this.channelService.deleteChannelById(chanID);
    if (deletedChan) {
      socket.leave(deletedChan.id);
      this.io.to(senderID).emit('channelDelete', {
        chanID: deletedChan.id,
        userID: senderID
      });
    }
  }

  @Restrict(['banned'])
  @Roles(['stranger'])
  @UseGuards(JoinChannelGuard)
  @SubscribeMessage('channelJoin')
  async handleJoinChannel(
    @MessageBody(new ValidationPipe()) channelNameDto: ChannelNameDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanName } = channelNameDto;
    const clientId = socket.user.id!;
    this.logger.log(`ClientId ${clientId} request to join chan ${chanName}`);

    const user = await this.usersService.getUserById(clientId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        userID: clientId
      });
    }
    const channel = await this.channelService.addChannelMember(
      chanName,
      clientId
    );
    if (channel) {
      const pubChannel: PublicChannel = {
        chanID: channel.id,
        chanAdmins: channel.admins,
        creatorID: channel.creatorID,
        chanName: channel.chanName,
        chanType: channel.type,
        chanCreatedAt: channel.createdAt
      };
      socket.join(channel.id);
      this.io.to(clientId).emit('channelJoin', pubChannel);
      const pubChatUser: PublicChatUser = {
        username: user.username,
        userID: user.id,
        connected: user.connectedChat
      };
      this.io.to(channel.id).emit('channelUserJoin', pubChatUser);
    }
  }

  @Restrict(['muted'])
  @Roles(['creator', 'admin', 'member'])
  @SubscribeMessage('channelMessage')
  async handleChannelMessage(
    @MessageBody(new ValidationPipe()) messageDto: ChannelMessageDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID, content } = messageDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Incoming channel message from ${senderID} to ${chanID} with content: ${content}`
    );
    const chanMessage = await this.messageService.createChannelMessage({
      content,
      senderID,
      chanID
    });
    const sender = await this.usersService.getUserById(senderID);
    const channel = await this.channelService.getChanById(chanID);
    if (chanMessage && chanMessage.channelID) {
      const pubChanMessage: PublicChannelMessage = {
        messageID: chanMessage.id,
        content: chanMessage.content,
        sender: sender!.username,
        senderID: sender!.id,
        chanName: channel!.chanName,
        chanID: channel!.id,
        createdAt: chanMessage.createdAt
      };
      this.io.to(chanMessage.channelID).emit('channelMessage', pubChanMessage);
    }
  }

  @Roles(['member', 'admin'])
  @SubscribeMessage('channelLeave')
  async handleLeaveChannel(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    this.logger.log(`User ${senderID} leave channel [${chanID}]`);
    const channel = await this.channelService.removeChannelMember(
      chanID,
      senderID
    );
    if (channel) {
      const admins = channel.admins.filter((id) => id !== senderID);
      const adminsSet = new Set(admins);
      await this.channelService.updateAdmins(chanID, Array.from(adminsSet));
      socket.leave(channel.id);
      this.io.to(channel.id).to(senderID).emit('channelLeave', {
        chanID: channel.id,
        userID: senderID
      });
    }
  }

  @Roles(['creator', 'admin'])
  @SubscribeMessage('channelAddAdmin')
  async handleAddAdminChannel(
    @MessageBody(new ValidationPipe()) channelUsersDto: ChannelUsersDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { usersID, chanID } = channelUsersDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Add admin request for ${usersID} by ${senderID} for channel ${chanID}`
    );
    const channel = await this.channelService.getChanById(chanID);
    if (channel) {
      const newAdmins = channel.admins.concat(usersID);
      const adminsSet = new Set(newAdmins);
      await this.channelService.updateAdmins(chanID, Array.from(adminsSet));
      this.io.to(channel.id).emit('channelAddAdmin', {
        chanID: channel.id,
        userID: usersID
      });
    }
  }

  @Roles(['creator', 'admin'])
  @SubscribeMessage('channelRemoveAdmin')
  async handleRemoveAdminChannel(
    @MessageBody(new ValidationPipe()) channelUsersDto: ChannelUsersDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { usersID, chanID } = channelUsersDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Remove admin request for ${usersID} by ${senderID} for channel ${chanID}`
    );
    const channel = await this.channelService.getChanById(chanID);
    if (channel) {
      const admins = channel.admins.filter((admin) => !usersID.includes(admin));
      const adminsSet = new Set(admins);
      await this.channelService.updateAdmins(chanID, Array.from(adminsSet));
      this.io.to(channel.id).emit('channelRemoveAdmin', {
        chanID: channel.id,
        userID: usersID
      });
    }
  }

  @UseGuards(JoinChannelGuard)
  @SubscribeMessage('channelId')
  async handleChannelId(
    @MessageBody(new ValidationPipe()) channelNameDto: ChannelNameDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanName } = channelNameDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel id request for channel ${chanName} by user ${senderID}`
    );

    const channel = await this.channelService.getChanByName(chanName);
    if (channel) {
      this.io.to(senderID).emit('channelId', channel.id);
    }
  }

  @Roles(['member', 'admin', 'creator'])
  @SubscribeMessage('channelInfo')
  async handleChannelInfo(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel info request for channel ${chanID} by user ${senderID}`
    );

    const channel = await this.channelService.getChanById(chanID);
    if (channel) {
      const pubChan: PublicChannel = {
        chanID: channel.id,
        creatorID: channel.creatorID,
        chanName: channel.chanName,
        chanType: channel.type,
        chanAdmins: channel.admins,
        chanCreatedAt: channel.createdAt
      };
      this.io.to(senderID).emit('channelInfo', pubChan);
    }
  }

  @Roles(['creator', 'admin'])
  @SubscribeMessage('channelMode')
  async handleChannelMode(
    @MessageBody(new ValidationPipe()) channelDto: ChannelDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanName, type } = channelDto;
    let { password } = channelDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel mode change to ${type} requested by user ${senderID}`
    );

    const channel = await this.channelService.getChanByName(chanName);
    if (channel) {
      if (password) {
        const salt = await bcrypt.genSalt(CONST_SALT);
        const passwordHash = await bcrypt.hash(password, salt);
        password = passwordHash;
      }
      const privChan = await this.channelService.updateChanType(
        channel.id,
        type,
        password
      );
      if (privChan) {
        const pubChan: PublicChannel = {
          chanID: privChan.id,
          creatorID: privChan.creatorID,
          chanAdmins: privChan.admins,
          chanName: privChan.chanName,
          chanType: privChan.type,
          chanCreatedAt: privChan.createdAt
        };
        this.io.to(senderID).emit('channelMode', pubChan);
      }
    }
  }

  @Roles(['creator', 'admin', 'member'])
  @SubscribeMessage('channelMessages')
  async handleChannelMessages(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel messages request for channel ${chanID} by user ${senderID}`
    );

    const channel = await this.channelService.getChanByIdWithMessages(chanID);
    if (channel) {
      const { messages } = channel;
      let sender: any;
      const pubMessages: PublicChannelMessage[] = await Promise.all(
        messages.map(async (m) => {
          if (!sender || m.senderID !== sender.id) {
            sender = await this.usersService.getUserById(m.senderID);
          }
          return {
            content: m.content,
            messageID: m.id,
            sender: sender!.username,
            senderID: sender!.id,
            chanName: channel.chanName,
            chanID: channel.id,
            createdAt: m.createdAt
          };
        })
      );
      this.io.to(senderID).emit('channelMessages', pubMessages);
    }
  }

  @Roles(['creator', 'admin', 'member'])
  @SubscribeMessage('channelMembers')
  async handleChannelMembers(
    @MessageBody(new ValidationPipe()) channelIdDto: ChannelIdDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { chanID } = channelIdDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel members request for channel ${chanID} by user ${senderID}`
    );

    const channel = await this.channelService.getChanByIdWithMembers(chanID);
    if (channel) {
      const { members } = channel;
      const pubMembers: PublicChatUser[] = members.map((m) => ({
        userID: m.id,
        connected: m.connectedChat,
        username: m.username!
      }));
      this.io.to(senderID).emit('channelMembers', pubMembers);
    }
  }

  @Roles(['creator', 'admin'])
  @SubscribeMessage('channelRestrict')
  async handleRestrictUser(
    @MessageBody(new ValidationPipe()) channelRestrictDto: ChannelRestrictDto,
    @ConnectedSocket() socket: ChatSocket
  ) {
    const { userID, chanID, restrictType, reason, muteTime } =
      channelRestrictDto;
    const senderID = socket.user.id!;
    this.logger.log(
      `Channel restrict request for ${userID} by ${senderID} for channel ${chanID}. Restrict type: ${restrictType}`
    );
    const channel = await this.channelService.getChanById(chanID);
    const socketToRestrict = this.socketMap.get(userID);
    if (channel && socketToRestrict) {
      if (userID === channel.creatorID) {
        throw new ForbiddenException("Channel creator can't be restricted");
      }
      if (restrictType === 'BAN') {
        const newBans = channel.bans.concat(userID);
        const bansSet = new Set(newBans);
        await this.channelService.updateBans(chanID, Array.from(bansSet));

        const admins = channel.admins.filter((id) => id !== userID);
        const adminsSet = new Set(admins);
        await this.channelService.updateAdmins(chanID, Array.from(adminsSet));

        this.channelService.removeChannelMember(channel.id, userID);
        socketToRestrict.leave(channel.id);
        this.io.to(channel.id).to(userID).emit('channelLeave', {
          chanID: channel.id,
          userID
        });
      } else if (restrictType === 'MUTE') {
        const newMute = channel.mute.concat(userID);
        const muteSet = new Set(newMute);
        await this.channelService.updateMute(chanID, Array.from(muteSet));
        this.logger.debug(`userID ${userID} muted for ${muteTime} seconds`);
        setTimeout(
          async () => {
            const chan = await this.channelService.getChanById(chanID);
            if (chan) {
              const mutes = chan.mute.filter((m) => m !== userID);
              const s = new Set(mutes);
              this.channelService.updateMute(chanID, Array.from(s));
            }
            this.logger.debug(`userID ${userID} demuted!`);
          },
          muteTime ? 1000 * muteTime : 0
        );
      } else if (restrictType === 'KICK') {
        const admins = channel.admins.filter((id) => id !== userID);
        const adminsSet = new Set(admins);
        await this.channelService.updateAdmins(chanID, Array.from(adminsSet));

        this.channelService.removeChannelMember(channel.id, userID);
        socketToRestrict.leave(channel.id);
        this.io.to(channel.id).to(userID).emit('channelLeave', {
          chanID: channel.id,
          userID
        });
      } else if (restrictType === 'UNBAN') {
        const newBans = channel.bans.filter((id) => id !== userID);
        const bansSet = new Set(newBans);
        await this.channelService.updateBans(chanID, Array.from(bansSet));
      }
      this.io.to(chanID).to(userID).emit('channelRestrict', {
        userID,
        chanID: channel.id,
        reason,
        type: restrictType
      });
    }
  }
}
