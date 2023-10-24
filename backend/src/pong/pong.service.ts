import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PongSocket } from './pong.interface';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';
import { ClassicParty } from './party/classic-party/classic-party';
import { SpeedParty } from './party/speed-ball-party/speed-party';

@Injectable()
export class PongService {
  constructor(
    private classicWaitingRoom: ClassicWaitingRoom<ClassicParty>,
    private speedWaitingRoom: ClassicWaitingRoom<SpeedParty>
  ) {}

  // Classic Party event handlers

  handleClassicConnection(client: PongSocket): any {
    this.classicWaitingRoom.handleConnection(client);
  }

  handleJoinClassicWaitingRoom(client: PongSocket, io: Server) {
    this.classicWaitingRoom.handleJoinWaitingRoom(client, io, ClassicParty);
  }

  handleLeaveClassicWaitingRoom(client: PongSocket) {
    this.classicWaitingRoom.handleLeaveWaitingRoom(client);
  }

  handleClassicRole(client: PongSocket) {
    this.classicWaitingRoom.handleRole(client);
  }

  handleIsClassicPlayerReady(client: PongSocket) {
    this.classicWaitingRoom.handleIsPlayerReady(client);
  }

  handleClassicPlayerReady(client: PongSocket) {
    this.classicWaitingRoom.handlePlayerReady(client);
  }

  handleClassicArrowUp(client: PongSocket, isPressed: boolean) {
    this.classicWaitingRoom.handleArrowUp(client, isPressed);
  }

  handleClassicArrowDown(client: PongSocket, isPressed: boolean) {
    this.classicWaitingRoom.handleArrowDown(client, isPressed);
  }

  // Speed ball party event handlers

  handleSpeedConnection(client: PongSocket): any {
    this.speedWaitingRoom.handleConnection(client);
  }

  handleJoinSpeedWaitingRoom(client: PongSocket, io: Server) {
    this.speedWaitingRoom.handleJoinWaitingRoom(client, io, SpeedParty);
  }

  handleLeaveSpeedWaitingRoom(client: PongSocket) {
    this.speedWaitingRoom.handleLeaveWaitingRoom(client);
  }

  handleSpeedRole(client: PongSocket) {
    this.speedWaitingRoom.handleRole(client);
  }

  handleIsSpeedPlayerReady(client: PongSocket) {
    this.speedWaitingRoom.handleIsPlayerReady(client);
  }

  handleSpeedPlayerReady(client: PongSocket) {
    this.speedWaitingRoom.handlePlayerReady(client);
  }

  handleSpeedArrowUp(client: PongSocket, isPressed: boolean) {
    this.speedWaitingRoom.handleArrowUp(client, isPressed);
  }

  handleSpeedArrowDown(client: PongSocket, isPressed: boolean) {
    this.speedWaitingRoom.handleArrowDown(client, isPressed);
  }
}
