import { UUID } from '../../utils/types';

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
