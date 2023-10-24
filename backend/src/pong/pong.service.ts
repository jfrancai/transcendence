import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket, Status } from './pong.interface';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';

@Injectable()
export class PongService {
  constructor(private classicWaitingRoom: ClassicWaitingRoom<ClassicParty>) {}

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
