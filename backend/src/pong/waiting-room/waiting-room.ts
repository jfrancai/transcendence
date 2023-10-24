import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, RoomName, UserID } from '../pong.interface';
import { Player } from '../party/player';
import { Game } from '../party/game.abstract';

interface PartyConstructor<GameType> {
  new (p1: Player, p2: Player, name: string, io: Server): GameType;
}

@Injectable()
export class ClassicWaitingRoom<GameType extends Game> {
  private roomName: string = 'room-0';

  private roomCounter: number = 0;

  private waitingPlayer: Player | undefined;

  private parties: Map<RoomName | UserID, GameType> = new Map();

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

  public leaveWaitingRoom(id: UserID) {
    if (this.isUserWaiting(id)) {
      this.waitingPlayer = undefined;
    }
  }

  public joinParty(
    client: PongSocket,
    io: Server,
    PartyConstructor: PartyConstructor<GameType>
  ): string {
    client.join(this.roomName);
    if (this.waitingPlayer) {
      const player2 = new Player(client, 2);

      const party = new PartyConstructor(
        this.waitingPlayer,
        player2,
        this.roomName,
        io
      );
      io.to(party.partyName).emit('joinParty');

      this.parties.set(this.roomName, party);
      this.parties.set(party.player1.id, party);
      this.parties.set(party.player2.id, party);

      this.roomCounter += 1;
      this.roomName = `room-${this.roomCounter}`;

      this.waitingPlayer = undefined;
      return party.partyName;
    }
    this.waitingPlayer = new Player(client, 1);
    return this.roomName;
  }
}
