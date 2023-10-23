import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket } from '../pong.interface';
import { PartyClassic } from '../party/party';
import { Player } from '../party/player';

type RoomName = string;
type UserID = string;

@Injectable()
export class ClassicWaitingRoom {
  private roomName: string = 'room-0';

  private roomCounter: number = 0;

  private waitingPlayer: Player | undefined;

  private parties: Map<RoomName | UserID, PartyClassic> = new Map();

  public hasWaitingPlayer() {
    if (this.waitingPlayer) {
      return true;
    }
    return false;
  }

  public isUserWaiting(id: UserID) {
    if (this.waitingPlayer) {
      return id === this.waitingPlayer.id;
    }
    return false;
  }

  public getRoomName() {
    return this.roomName;
  }

  public getParty(id: RoomName | UserID) {
    return this.parties.get(id);
  }

  public removeParty(id: RoomName | UserID) {
    return this.parties.delete(id);
  }

  public joinParty(
    client: PongSocket,
    io: Server
  ): { partyName: string; player: Player } {
    client.join(this.roomName);
    if (this.waitingPlayer) {
      const player2 = new Player(client, 2);
      const party = new PartyClassic(
        this.waitingPlayer,
        player2,
        this.roomName,
        io
      );

      this.parties.set(this.roomName, party);
      this.parties.set(party.player1.id, party);
      this.parties.set(party.player2.id, party);

      this.roomCounter += 1;
      this.roomName = `room-${this.roomCounter}`;

      this.waitingPlayer = undefined;
      return { partyName: party.partyName, player: player2 };
    }
    this.waitingPlayer = new Player(client, 1);
    return { partyName: this.roomName, player: this.waitingPlayer };
  }
}
