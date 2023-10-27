import { Socket } from 'socket.io';
import { IUsers } from 'src/database/service/interface/users';

export interface PongSocket extends Socket {
  user: Partial<IUsers>;
}

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
