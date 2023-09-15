import { UUID } from 'src/utils/types';

export default interface IMessage {
  id: UUID;
  content: string;
  senderId: UUID;
  receiverId: UUID;
}
