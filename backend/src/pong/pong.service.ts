import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, Status } from './pong.interface';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';

@Injectable()
export class PongService {
  constructor(private waitingRoomService: ClassicWaitingRoom) {}

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
    let status: Status;
    if (party) {
      client.join(party.partyName);
      if (party.isStarted) {
        status = 'partyStarted';
      } else {
        status = 'partyNotStarted';
      }
    } else if (this.waitingRoomService.isUserWaiting(clientID)) {
      status = 'waitingRoom';
    } else {
      status = 'default';
    }
    client.emit('connection', status);
  }

  handleJoinWaitingRoom(client: PongSocket, io: Server) {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
    if (party) return;

    this.waitingRoomService.joinParty(client, io);
    client.emit('joinWaitingRoom');
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    this.waitingRoomService.leaveWaitingRoom(clientID);
    client.emit('leaveWaitingRoom');
  }

  handleRole(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
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
    const party = this.waitingRoomService.getParty(clientID);
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
    const party = this.waitingRoomService.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID);
      party.startParty(() => {
        this.waitingRoomService.removeParty(party.partyName);
        this.waitingRoomService.removeParty(party.player2.id);
        this.waitingRoomService.removeParty(party.player1.id);
      });
    }
    client.emit('playerReady', ready);
  }

  handleArrowUp(client: PongSocket, isPressed: boolean) {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowUp', isPressed);
    }
  }

  handleArrowDown(client: PongSocket, isPressed: boolean) {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowDown', isPressed);
    }
  }
}
