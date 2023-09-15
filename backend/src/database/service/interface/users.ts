import { UUID } from 'src/utils/types';
import IMessage from './message';

export interface IUsers {
  id: UUID;
  email: string;
  username: string;
  password: string;
  apiToken: string;
}

export type IUsersMessages = {
  sentMessages: IMessage[];
  receivedMessages: IMessage[];
} & IUsers;
