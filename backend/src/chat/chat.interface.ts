import { Socket } from 'socket.io';

export interface Chat {}

export type SessionID = string;
export type UserID = string;
export type Username = string;

export interface ChatSocket extends Socket {
  username: Username;
  userID: UserID;
  connected: boolean;
}
