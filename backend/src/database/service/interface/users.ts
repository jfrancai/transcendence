import ITwoAuth from './two-auth';

export type ChannelType = 'PUBLIC' | 'PRIVATE' | 'PASSWORD';

export type ChatRestrictType = 'BAN' | 'MUTE';

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
  user: IUsers;
  usersId: string;
  channel: IChannel;
  channelId: string;
  createdAt: Date;
}

export interface IChanRestrict {
  id: string;
  type: ChannelType;
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
  type: ChatRestrictType;
  createdAt: Date;
  password: string | null;
  creatorId: string;
  admins: string[];
  members: IUsers[];
  inviteList: IChanInvite[];
  restrictList: IChanRestrict[];
  messages: IMessage[];
}

export interface IUsers {
  id: string;
  email: string;
  username: string;
  password: string;
  apiToken: string;
  twoAuth: ITwoAuth;
  connectedChat: boolean;
  inviteList: IChanInvite[];
  restrictList: IChanRestrict[];
  channels: IChannel[];
}
