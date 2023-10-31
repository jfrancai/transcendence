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

  private speedWaitingRoom: WaitingRoom = new WaitingRoom(SpeedParty);

  private classicWaitingRoom: WaitingRoom = new WaitingRoom(ClassicParty);

  constructor(private matchService: MatchService) {}

  handleConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
    const room = this.rooms.get(client.user.id!);
    if (room) room.handleConnection(client);
  }

  isInParty(id: UserID) {
    return this.speedWaitingRoom.isInParty(id) || this.classicWaitingRoom.isInParty(id);
  }

  handleJoinSpeedWaitingRoom(client: PongSocket, io: Server) {
    const id = client.user.id!;
    if (
      !this.speedWaitingRoom.isInParty(id) &&
      !this.speedWaitingRoom.isInInviteRoom(id)
    ) {
      this.speedWaitingRoom.handleJoinWaitingRoom(client, io);
      this.rooms.set(client.user.id!, this.speedWaitingRoom);
    }
  }

  handleJoinClassicWaitingRoom(client: PongSocket, io: Server) {
    const id = client.user.id!;
    if (
      !this.classicWaitingRoom.isInParty(id) &&
      !this.classicWaitingRoom.isInInviteRoom(id)
    ) {
      this.classicWaitingRoom.handleJoinWaitingRoom(client, io);
      this.rooms.set(client.user.id!, this.classicWaitingRoom);
    }
  }

  handleCreateClassicInvite(player1: PongSocket, player2: PongSocket) {
    const id2 = player2.user.id!;
    if (
      this.isInvitable(id2, player1) &&
      this.classicWaitingRoom.handleCreateInvite(player1, player2)
    ) {
      this.rooms.set(player1.user.id!, this.classicWaitingRoom);
    }
  }

  handleDestroyInvite(player1: PongSocket) {
    this.classicWaitingRoom.handleDestroyInvite(player1);
    this.speedWaitingRoom.handleDestroyInvite(player1);
  }

  private isInvitable(id: UserID, playerInviting: PongSocket) {
    const classicParty = this.classicWaitingRoom.getParty(id);
    const speedParty = this.speedWaitingRoom.getParty(id);
    if (classicParty || speedParty) {
      playerInviting.emit('playerAlreadyPlaying');
      return false;
    }
    const classicInvite = this.classicWaitingRoom.getInvite(id);
    const speedInvite = this.speedWaitingRoom.getInvite(id);
    if (classicInvite || speedInvite) {
      playerInviting.emit('playerAlreadyInvited');
      return false;
    }
    return true;
  }

  handleCreateSpeedInvite(player1: PongSocket, player2: PongSocket) {
    const id2 = player2.user.id!;
    if (
      this.isInvitable(id2, player1) &&
      this.speedWaitingRoom.handleCreateInvite(player1, player2)
    ) {
      this.rooms.set(player1.user.id!, this.speedWaitingRoom);
    }
  }

  handleAcceptClassicInvite(client: PongSocket, io: Server) {
    if (this.classicWaitingRoom.handleAcceptInvite(client, io)) {
      this.rooms.set(client.user.id!, this.classicWaitingRoom);
    }
  }

  handleAcceptSpeedInvite(client: PongSocket, io: Server) {
    if (this.speedWaitingRoom.handleAcceptInvite(client, io)) {
      this.rooms.set(client.user.id!, this.speedWaitingRoom);
    }
  }

  handleDenyClassicInvite(client: PongSocket) {
    this.classicWaitingRoom.handleDenyInvite(client);
  }

  handleDenySpeedInvite(client: PongSocket) {
    this.speedWaitingRoom.handleDenyInvite(client);
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

  handlePlayerReady(client: PongSocket, isReady: boolean) {
    const room = this.rooms.get(client.user.id!);
    if (room) {
      room.handlePlayerReady(client, isReady, this.matchService);
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

  handleLeaveParty(client: PongSocket) {
    this.classicWaitingRoom.removeParty(client.user.id!);
    this.speedWaitingRoom.removeParty(client.user.id!);
  }
}
