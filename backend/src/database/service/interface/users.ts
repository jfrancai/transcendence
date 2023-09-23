import { $Enums } from '@prisma/client';
import ITwoAuth from './two-auth';

export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  channel?: IChannel;
  channelId?: string;
}

export interface IChanInvite {
  id: string;
  usersId: string;
  channelId: string;
  createdAt: Date;
}

export interface IChanRestrict {
  id: string;
  type: $Enums.ChatRestrictType;
  user: IUsers;
  usersId: string;
  channel: IChannel;
  channelId: string;
  createdAt: Date;
  endOfRestrict: Date;
}

export interface IChannel {
  id: string;
  displayName: string;
  type: $Enums.ChannelType;
  createdAt: Date;
  password: string | null;
  creatorId: string;
  admins: string[];
  members: Partial<IUsers>[];
  inviteList: Partial<IChanInvite>[];
  restrictList: Partial<IChanRestrict>[];
  messages: Partial<IMessage>[];
}

export interface IUsers {
  id: string;
  email: string;
  username: string;
  password: string;
  apiToken: string | null;
  twoAuth: ITwoAuth;
  connectedChat: boolean;
  inviteList: Partial<IChanInvite>[];
  restrictList: Partial<IChanRestrict>[];
  channels: Partial<IChannel>[];
}
