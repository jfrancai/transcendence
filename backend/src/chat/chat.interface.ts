import { Socket } from 'socket.io';
import { IUsersMessages } from '../database/service/interface/users';

export interface ChatSocket extends Socket {
  user: Partial<IUsersMessages>;
  connected: boolean;
}

export interface PublicChatUser {
  username: string;
  messages: PublicChatMessage[];
}

export interface PublicChatMessage {
  content: string;
  sender: string;
  receiver: string;
}
