import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, UserID } from './pong.interface';
import { WaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';
import { SpeedParty } from './party/speed-ball-party/speed-party';

@Injectable()
export class PongService {
  private rooms: Map<UserID, WaitingRoom> = new Map();

  private speedWaitingRoom: WaitingRoom = new WaitingRoom(SpeedParty);

  private classicWaitingRoom: WaitingRoom = new WaitingRoom(ClassicParty);

  handleConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
    const room = this.rooms.get(client.user.id!);
    if (room) room.handleConnection(client);
  }

  handleJoinSpeedWaitingRoom(client: PongSocket, io: Server) {
    const id = client.user.id!;
    if (
      !this.speedWaitingRoom.isInParty(id) &&
      !this.speedWaitingRoom.isInInviteRoom(id)
    ) {
      const hasJoined = this.speedWaitingRoom.handleJoinWaitingRoom(client, io);
      if (hasJoined) {
        this.rooms.set(client.user.id!, this.speedWaitingRoom);
      }
    }
  }

  handleJoinClassicWaitingRoom(client: PongSocket, io: Server) {
    const id = client.user.id!;
    if (
      !this.classicWaitingRoom.isInParty(id) &&
      !this.classicWaitingRoom.isInInviteRoom(id)
    ) {
      const hasJoined = this.classicWaitingRoom.handleJoinWaitingRoom(
        client,
        io
      );
      if (hasJoined) {
        this.rooms.set(client.user.id!, this.classicWaitingRoom);
      }
    }
  }

  handleCreateClassicInvite(player1: PongSocket, player2: PongSocket) {
    if (this.classicWaitingRoom.handleCreateInvite(player1, player2)) {
      this.rooms.set(player1.user.id!, this.classicWaitingRoom);
    }
  }

  handleDestroyClassicInvite(player1: PongSocket, player2: PongSocket) {
    this.classicWaitingRoom.handleDestroyInvite(player1, player2);
  }

  handleCreateSpeedInvite(player1: PongSocket, player2: PongSocket) {
    if (this.speedWaitingRoom.handleCreateInvite(player1, player2)) {
      this.rooms.set(player1.user.id!, this.speedWaitingRoom);
    }
  }

  handleDestroySpeedInvite(player1: PongSocket, player2: PongSocket) {
    this.speedWaitingRoom.handleDestroyInvite(player1, player2);
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
    if (room) {
      room.handleLeaveWaitingRoom(client);
      this.rooms.delete(client.user.id!);
    }
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
      room.handlePlayerReady(client, isReady);
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
}
