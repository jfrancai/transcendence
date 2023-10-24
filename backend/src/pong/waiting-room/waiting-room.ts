import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, RoomName, Status, UserID } from '../pong.interface';
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

  private isUserWaiting(id: UserID) {
    if (this.waitingPlayer) {
      return id === this.waitingPlayer.id;
    }
    return false;
  }

  public getRoomName() {
    return this.roomName;
  }

  private getParty(id: RoomName | UserID) {
    return this.parties.get(id);
  }

  private removeParty(id: RoomName | UserID) {
    return this.parties.delete(id);
  }

  private leaveWaitingRoom(id: UserID) {
    if (this.isUserWaiting(id)) {
      this.waitingPlayer = undefined;
    }
  }

  private joinParty(
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

  public handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let status: Status;
    if (party) {
      client.join(party.partyName);
      if (party.isStarted) {
        status = 'partyStarted';
      } else {
        status = 'partyNotStarted';
      }
    } else if (this.isUserWaiting(clientID)) {
      status = 'waitingRoom';
    } else {
      status = 'default';
    }
    client.emit('connection', status);
  }

  public handleJoinWaitingRoom(
    client: PongSocket,
    io: Server,
    PartyConstructor: PartyConstructor<GameType>
  ) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    if (party) return;

    this.joinParty(client, io, PartyConstructor);
    client.emit('joinWaitingRoom');
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    this.leaveWaitingRoom(clientID);
    client.emit('leaveWaitingRoom');
  }

  handleRole(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    const response = { role: 0 };
    if (party) {
      if (party.isPlayer1(clientID)) {
        response.role = 1;
      } else {
        response.role = 2;
      }
    }
    client.emit('playerRole', response);
  }

  handleIsPlayerReady(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.isPlayer1(clientID)
        ? party.player1.isReady
        : party.player2.isReady;
    }
    client.emit('isPlayerReady', ready);
  }

  handlePlayerReady(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID);
      party.startParty(() => {
        this.removeParty(party.partyName);
        this.removeParty(party.player2.id);
        this.removeParty(party.player1.id);
      });
    }
    client.emit('playerReady', ready);
  }

  handleArrowUp(client: PongSocket, isPressed: boolean) {
    const party = this.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowUp', isPressed);
    }
  }

  handleArrowDown(client: PongSocket, isPressed: boolean) {
    const party = this.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowDown', isPressed);
    }
  }
}
