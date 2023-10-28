import { v4 as uuid } from 'uuid';
import { PongSocket } from '../pong.interface';

export class Invite {
  partyName: string = uuid();

  idInvited: string;

  playerInviting: PongSocket;

  constructor(socketP1: PongSocket, idInvited: string) {
    this.playerInviting = socketP1;
    this.idInvited = idInvited;
  }
}
