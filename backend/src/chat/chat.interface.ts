import { Socket } from 'socket.io';
import { IUsers } from '../database/service/interface/users';

export interface ChatSocket extends Socket {
  user: Partial<IUsers>;
  connected: boolean;
  headers: any;
}

export interface PublicChatUser {
  userID: string;
  connected: boolean;
  username: string;
}

export interface PublicMessage {
  messageID: string;
  content: string;
  sender: string;
  senderID: string;
  receiver: string | null;
  receiverID: string | null;
  createdAt: Date;
}

export interface PublicChannelMessage {
  messageID: string;
  content: string;
  sender: string;
  senderID: string;
  chanName: string | null;
  chanID: string | null;
  createdAt: Date;
}

export interface PublicChannel {
  chanID: string;
  creatorID: string;
  chanName: string;
  chanType: string;
  chanAdmins: string[];
  chanCreatedAt: Date;
}
