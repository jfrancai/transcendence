import { Injectable } from '@nestjs/common';
import { PongSocket, UserID } from './pong.interface';
import { WaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';
import { SpeedParty } from './party/speed-ball-party/speed-party';
import { PublicWaitingRoom } from './waiting-room/public-waiting-room';

@Injectable()
export class PongService {
  private rooms: Map<UserID, WaitingRoom> = new Map();

  private speedWaitingRoom: WaitingRoom = new PublicWaitingRoom();

  private classicWaitingRoom: WaitingRoom = new PublicWaitingRoom();

  handleConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
    const room = this.rooms.get(client.user.id!);
    if (room) room.handleConnection(client);
  }

  handleJoinWaitingRoom(client: PongSocket, type: 'classic' | 'speed') {
    if (type === 'classic') {
      this.classicWaitingRoom.joinWaitingRoom(client, ClassicParty);
      this.rooms.set(client.user.id!, this.classicWaitingRoom);
    } else {
      this.speedWaitingRoom.joinWaitingRoom(client, SpeedParty);
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
