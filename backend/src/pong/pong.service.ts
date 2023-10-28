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

  handleJoinWaitingRoom(
    client: PongSocket,
    type: 'classic' | 'speed',
    io: Server
  ) {
    if (type === 'classic') {
      this.classicWaitingRoom.handleJoinWaitingRoom(client, io);
      this.rooms.set(client.user.id!, this.classicWaitingRoom);
    } else {
      this.speedWaitingRoom.handleJoinWaitingRoom(client, io);
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
