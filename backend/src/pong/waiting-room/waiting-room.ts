import { v4 as uuid } from 'uuid';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MatchService } from 'src/database/service/match.service';
import { PongSocket, RoomName, Status, UserID } from '../pong.interface';
import { Player } from '../party/player';
import { Game } from '../party/game.abstract';
import { ClassicParty } from '../party/classic-party/classic-party';

export interface PartyConstructor<GameType> {
  new (p1: Player, p2: Player, name: string, io: Server): GameType;
}

export class WaitingRoom {
  private logger = new Logger(WaitingRoom.name);

  private roomName: string;

  private waitingPlayer: Player | undefined;

  private parties: Map<RoomName | UserID, Game> = new Map();

  constructor(roomName: string) {
    this.roomName = roomName;
  }

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
    PartyConstructor: PartyConstructor<Game>
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

      this.roomName = uuid();

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

  public handleJoinWaitingRoom(
    client: PongSocket,
    io: Server,
    PartyConstructor: PartyConstructor<Game>
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

  handlePlayerReady(
    client: PongSocket,
    isReady: boolean,
    matchService: MatchService
  ) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID, isReady);
      party.startParty(() => {
        this.handleDataOfMatch(party, party.playerWon, matchService);
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

  handleDataOfMatch(
    party: Game,
    playerWon: number,
    matchService: MatchService
  ) {
    const player1Id = party.player1.id;
    const player2Id = party.player2.id;
    const timestamp = Date.now();

    this.logger.debug(
      `playerWonParty: ${party.playerWon}, player1Id: ${player1Id}, player2Id: ${player2Id}`
    );
    if (playerWon === 1) {
      const winMatchHistory = `1|${player2Id}|${timestamp}`;
      const lostMatchHistory = `0|${player1Id}|${timestamp}`;

      matchService.addMatchHistory(player1Id, winMatchHistory);
      matchService.addMatchHistory(player2Id, lostMatchHistory);
    } else if (playerWon === 2) {
      const winMatchHistory = `1|${player1Id}|${timestamp}`;
      const lostMatchHistory = `0|${player2Id}|${timestamp}`;

      matchService.addMatchHistory(player2Id, winMatchHistory);
      matchService.addMatchHistory(player1Id, lostMatchHistory);
    }
  }
}
