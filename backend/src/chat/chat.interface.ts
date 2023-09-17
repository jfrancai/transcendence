import { Socket } from 'socket.io';
import { IUsers } from '../database/service/interface/users';
import { UUID } from '../utils/types';

export interface ChatSocket extends Socket {
  user: Partial<IUsers>;
  connected: boolean;
}

export interface PublicChatUser {
  userID: UUID;
  username: string;
  messages: PublicChatMessage[];
}

export interface PublicChatMessage {
  content: string;
  sender: string;
  receiver: string;
}
