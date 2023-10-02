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
  receiver: string;
  receiverID: string;
  createdAt: Date;
}

export interface PublicChannelMessage {
  messageID: string;
  chanID: string;
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}

export interface PublicChannel {
  chanID: string;
  chanName: string;
  chanType: string;
  chanCreatedAt: Date;
}
