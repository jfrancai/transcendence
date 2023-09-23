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
  messages: PublicChatMessage[];
}

export interface PublicChatMessage {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}

export interface PublicChannel {
  id: string;
  displayName: string;
  userID: string;
  messages: PublicChatMessage[];
  members: Partial<PublicChatUser>[];
}
