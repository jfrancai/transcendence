import { Socket } from 'socket.io';

export interface Chat {}

export interface ChatSocket extends Socket {
  username: string;
  sessionID: string;
  userID: string;
}
