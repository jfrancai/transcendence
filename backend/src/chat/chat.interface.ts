import { Socket } from 'socket.io';
import { IUsers } from '../database/service/interface/users';
import { UUID } from '../utils/types';

export interface ChatSocket extends Socket {
  user: Partial<IUsers>;
  connected: boolean;
}

export interface PublicChatUser {
  userID: UUID;
  connected: boolean;
  username: string;
  messages: PublicChatMessage[];
}

export interface PublicChatMessage {
  id: UUID;
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}
