import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/database/service/match.service';
import { PongSocket, UserID } from './pong.interface';
import { WaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';
import { SpeedParty } from './party/speed-ball-party/speed-party';

@Injectable()
export class PongService {
  private rooms: Map<UserID, WaitingRoom> = new Map();

  private speedWaitingRoom: WaitingRoom = new WaitingRoom('speed');

  private classicWaitingRoom: WaitingRoom = new WaitingRoom('classic');

  constructor(private matchService: MatchService) { }

  handleConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
    const room = this.rooms.get(client.user.id!);
    if (room) room.handleConnection(client);
  }

  handleJoinWaitingRoom(
    client: PongSocket,
    io: Server,
    type: 'classic' | 'speed'
  ) {
    if (type === 'classic') {
      this.classicWaitingRoom.handleJoinWaitingRoom(client, io, ClassicParty);
      this.rooms.set(client.user.id!, this.classicWaitingRoom);
    } else {
      this.speedWaitingRoom.handleJoinWaitingRoom(client, io, SpeedParty);
      this.rooms.set(client.user.id!, this.speedWaitingRoom);
    }
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    const room = this.rooms.get(client.user.id!);
    if (room) room.handleLeaveWaitingRoom(client);
  }

  handleRole(client: PongSocket) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handleRole(client);
    }
  }

  handleIsPlayerReady(client: PongSocket) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handleIsPlayerReady(client);
    }
  }

<<<<<<< HEAD
  handlePlayerReady(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID);
      party.startParty(() => {
        this.waitingRoomService.removeParty(party.partyName);
        this.handleDataOfMatch(party, party.playerWon);
        this.waitingRoomService.removeParty(party.player2.id);
        this.waitingRoomService.removeParty(party.player1.id);
      });
=======
  handlePlayerReady(client: PongSocket, isReady: boolean) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handlePlayerReady(client, isReady, this.matchService);
>>>>>>> main
    }
  }

  handleArrowUp(client: PongSocket, isPressed: boolean) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handleArrowUp(client, isPressed);
    }
  }

  handleArrowDown(client: PongSocket, isPressed: boolean) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handleArrowDown(client, isPressed);
    }
  }

  handleDataOfMatch(party: PartyClassic, playerWon: number) {
    const player1Id = party.player1.id;
    const player2Id = party.player2.id;
    const timestamp = Date.now();

    this.logger.debug(
      `playerWonParty: ${party.playerWon}, player1Id: ${player1Id}, player2Id: ${player2Id}`
    );
    if (playerWon === 1) {
      const winMatchHistory = `1|${player2Id}|${timestamp}`;
      const lostMatchHistory = `0|${player1Id}|${timestamp}`;

      this.matchService.addMatchHistory(player1Id, winMatchHistory);
      this.matchService.addMatchHistory(player2Id, lostMatchHistory);
    } else if (playerWon === 2) {
      const winMatchHistory = `1|${player1Id}|${timestamp}`;
      const lostMatchHistory = `0|${player2Id}|${timestamp}`;

      this.matchService.addMatchHistory(player2Id, winMatchHistory);
      this.matchService.addMatchHistory(player1Id, lostMatchHistory);
    }
  }
}
