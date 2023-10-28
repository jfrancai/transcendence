import { v4 as uuid } from 'uuid';
import { PongSocket } from '../pong.interface';

export class Invite {
  partyName: string = uuid();

  player1: PongSocket;

  player2: PongSocket;

  constructor(p1: PongSocket, p2: PongSocket) {
    this.player1 = p1;
    this.player2 = p2;
  }
}
