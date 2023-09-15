import { Socket } from 'socket.io';
import IUsers from 'src/database/service/interface/users';

export interface Chat {}

export interface ChatSocket extends Socket {
  user: Partial<IUsers>;
  connected: boolean;
}
