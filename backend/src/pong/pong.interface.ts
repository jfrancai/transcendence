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

interface Position {
  x: number;
  y: number;
}

interface PaddleShape extends Position {
  width: number;
  height: number;
}

interface BallShape extends Position {
  radius: number;
}

interface CanvaShape {
  width: number;
  height: number;
}

export interface GameState {
  ball: BallShape;
  leftPaddle: PaddleShape;
  rightPaddle: PaddleShape;
  canva: CanvaShape;
  scorePlayer1: number;
  scorePlayer2: number;
  maxScore: number;
}
