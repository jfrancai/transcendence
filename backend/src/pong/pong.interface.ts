import { Socket } from 'socket.io';
import { IUsers } from 'src/database/service/interface/users';

export interface PongSocket extends Socket {
  user: Partial<IUsers>;
}

export type RoomName = string;

export type UserID = string;

export type Status =
  | 'default'
  | 'waitingRoom'
  | 'partyStarted'
  | 'partyNotStarted'
  | 'partyEnded';
