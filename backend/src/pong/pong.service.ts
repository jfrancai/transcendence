import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, UserID } from './pong.interface';
import { WaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';
import { SpeedParty } from './party/speed-ball-party/speed-party';

@Injectable()
export class PongService {
  private rooms: Map<UserID, WaitingRoom> = new Map();

  constructor(
    private classicWaitingRoom: WaitingRoom,
    private speedWaitingRoom: WaitingRoom
  ) {}

  handleConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
  }

  handleJoinWaitingRoom(client: PongSocket, io: Server) {
    this.classicWaitingRoom.handleJoinWaitingRoom(client, io, ClassicParty);
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    this.classicWaitingRoom.handleLeaveWaitingRoom(client);
  }

  handleRole(client: PongSocket) {
    this.classicWaitingRoom.handleRole(client);
  }

  handleIsPlayerReady(client: PongSocket) {
    this.classicWaitingRoom.handleIsPlayerReady(client);
  }

  handlePlayerReady(client: PongSocket) {
    this.classicWaitingRoom.handlePlayerReady(client);
  }

  handleArrowUp(client: PongSocket, isPressed: boolean) {
    this.classicWaitingRoom.handleArrowUp(client, isPressed);
  }

  handleArrowDown(client: PongSocket, isPressed: boolean) {
    this.classicWaitingRoom.handleArrowDown(client, isPressed);
  }
}
