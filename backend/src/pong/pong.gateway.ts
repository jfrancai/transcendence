import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PongSocket } from './pong.interface';
import { PongService } from './pong.service';
import { ClassicParty } from './party/classic-party/classic-party';

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  constructor(private pongService: PongService) {}

  afterInit() {
    this.logger.log('Initialize');
  }

  handleConnection(client: PongSocket): any {
    this.pongService.handleConnection(client);
    this.logger.debug(`New connection : ${client.user.id}`);
  }

  handleDisconnect(client: PongSocket): any {
    this.pongService.handleLeaveWaitingRoom(client);
    this.logger.debug(`Disconnected : ${client.user.id}`);
  }

  @SubscribeMessage('leaveWaitingRoom')
  handleLeaveWaitingRoom(client: PongSocket) {
    this.pongService.handleLeaveWaitingRoom(client);
  }

  @SubscribeMessage('joinWaitingRoom')
  handleJoinWaitingRoom(client: PongSocket) {
    this.pongService.handleJoinWaitingRoom(client, this.io);
  }

  @SubscribeMessage('playerRole')
  handleRole(client: PongSocket) {
    this.pongService.handleRole(client);
  }

  @SubscribeMessage('playAgain')
  handlePlayAgain(client: PongSocket) {
    client.emit('playAgain');
  }

  @SubscribeMessage('initialState')
  handleInitialState(client: PongSocket) {
    client.emit('gameState', ClassicParty.getInitGameState());
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    this.pongService.handlePlayerReady(client);
  }

  @SubscribeMessage('isPlayerReady')
  handleIsPlayerReady(client: PongSocket) {
    this.pongService.handleIsPlayerReady(client);
  }

  @SubscribeMessage('arrowUp')
  handleArrowUp(client: PongSocket, isPressed: boolean): void {
    this.pongService.handleArrowUp(client, isPressed);
  }

  @SubscribeMessage('arrowDown')
  handleArrowDown(client: PongSocket, isPressed: boolean): void {
    this.pongService.handleArrowDown(client, isPressed);
  }
}
