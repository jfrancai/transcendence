import { PongSocket } from '../pong.interface';

export class Player {
  constructor(s: PongSocket, r: 1 | 2) {
    this.socket = s;
    this.id = s.user.id!;
    this.role = r;
  }

  id: string;

  socket: PongSocket;

  role: 1 | 2;

  isReady: boolean = false;
}
