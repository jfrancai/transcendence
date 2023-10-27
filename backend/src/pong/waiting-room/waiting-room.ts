import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PongSocket, RoomName, Status, UserID } from '../pong.interface';
import { Game } from '../party/game.abstract';
import { ClassicParty } from '../party/classic-party/classic-party';
import { Player } from '../party/player';

interface PartyConstructor<GameType> {
  new (p1: Player, p2: Player, name: string): GameType;
}

export abstract class WaitingRoom {
  protected roomName: string = uuid();

  protected PartyConstructor: PartyConstructor<Game>;

  protected parties: Map<RoomName | UserID, Game> = new Map();

  @WebSocketServer() io: Server;

  constructor(PartyConstructor: PartyConstructor<Game>) {
    this.PartyConstructor = PartyConstructor;
  }
  abstract handleLeaveWaitingRoom(client: PongSocket): void;
  abstract handleJoinWaitingRoom(
    client: PongSocket,
    PartyConstructor: PartyConstructor<Game>
  ): void;

  protected joinParty(client1: PongSocket, client2: PongSocket) {
    const player1 = new Player(client1, 1);
    const player2 = new Player(client2, 2);

    const party = new this.PartyConstructor(player1, player2, this.roomName);
    this.io.to(party.partyName).emit('joinParty');
    this.parties.set(this.roomName, party);
    this.parties.set(party.player1.id, party);
    this.parties.set(party.player2.id, party);
    this.roomName = uuid();
  }

  protected getParty(id: RoomName | UserID) {
    return this.parties.get(id);
  }

  protected removeParty(id: RoomName | UserID) {
    return this.parties.delete(id);
  }

  getRoomName() {
    return this.roomName;
  }

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let status: Status;
    if (party) {
      client.join(party.partyName);
      if (party.isStarted) {
        status =
          party instanceof ClassicParty
            ? 'CLASSIC_INIT_MATCH'
            : 'SPEED_INIT_MATCH';
      } else if (party.isOver) {
        status =
          party instanceof ClassicParty ? 'CLASSIC_INIT_END' : 'SPEED_INIT_END';
      } else {
        status =
          party instanceof ClassicParty
            ? 'CLASSIC_INIT_READY'
            : 'SPEED_INIT_READY';
      }
      client.emit('connection', status);
    }
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

  handlePlayerReady(client: PongSocket, isReady: boolean) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID, isReady);
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
