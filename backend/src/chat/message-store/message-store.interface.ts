import { UUID } from 'src/utils/types';

export interface Message {
  content: string;
  from: string;
  to: string;
}

export interface MessageStore {
  saveMessage(message: Message): any;
  findMessageForUser(userID: UUID): any;
}
