import { Socket } from 'socket.io';
import { IUsers } from '../database/service/interface/users';
import { UUID } from '../utils/types';

export interface ChatSocket extends Socket {
  user: Partial<IUsers>;
  connected: boolean;
}

export interface ChatUser {
  userID: UUID;
  username: string;
  sentMessages: ChatMessage[];
  receivedMessages: ChatMessage[];
}

export interface ChatMessage {
  content: string;
  sender: string;
  receiver: string;
}
