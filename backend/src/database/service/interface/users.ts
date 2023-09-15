import { UUID } from 'src/utils/types';
import IMessage from './message';

export default interface IUsers {
  id: UUID;
  email: string;
  username: string;
  password: string;
  sentMessages: IMessage[];
  receivedMessages: IMessage[];
}
