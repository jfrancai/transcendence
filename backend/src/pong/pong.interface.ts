import { Socket } from 'socket.io';
import { IUsers } from 'src/database/service/interface/users';

export interface PongSocket extends Socket {
  user: Partial<IUsers>;
}

export type RoomName = string;

export type UserID = string;

export type Status =
  | 'CLASSIC_INIT_READY'
  | 'CLASSIC_INIT_END'
  | 'CLASSIC_INIT_MATCH'
  | 'CLASSIC_MODE'
  | 'SPEED_INIT_READY'
  | 'SPEED_INIT_END'
  | 'SPEED_INIT_MATCH'
  | 'SPEED_MODE';

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
