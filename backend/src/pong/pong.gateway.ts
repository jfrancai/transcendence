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
import { PartyClassic } from './party/party';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';
import { PongService } from './pong.service';

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  constructor(
    private pongService: PongService,
    private waitingRoomService: ClassicWaitingRoom
  ) {}

  afterInit() {
    this.logger.log('Initialize');
  }

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    // const party = this.waitingRoomService.getParty(clientID);
    // if (party) {
    //  client.join(party.partyName);

    //  if (party.isStarted) {
    //    client.emit('startGame', party.partyName);
    //  } else {
    //    this.io.to(party.partyName).emit('joinParty');
    //    client.emit('playerReady', party.isPlayerReady(clientID));
    //  }
    // } else if (this.waitingRoomService.isUserWaiting(clientID)) {
    //  client.join(this.waitingRoomService.getRoomName());
    //  client.emit('joinWaitingRoom');
    // }
    this.logger.debug(`New connection : ${client.user.id}`);
  }

  handleDisconnect(client: PongSocket): any {
    this.logger.debug(`Disconnected : ${client.user.id}`);
  }

  @SubscribeMessage('joinWaitingRoom')
  handleJoinWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
    if (party) return;

    this.waitingRoomService.joinParty(client, this.io);
    client.emit('joinWaitingRoom');
  }

  @SubscribeMessage('playerRole')
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

  @SubscribeMessage('playAgain')
  handlePlayAgain(client: PongSocket) {
    client.emit('gameOver', false);
  }

  @SubscribeMessage('initialState')
  handleInitialState(client: PongSocket) {
    client.emit('gameState', PartyClassic.getInitGameState());
  }

  @SubscribeMessage('playerReady')
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

  @SubscribeMessage('arrowUp')
  handleArrowUp(client: PongSocket, isPressed: boolean): void {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowUp', isPressed);
    }
  }

  @SubscribeMessage('arrowDown')
  handleArrowDown(client: PongSocket, isPressed: boolean): void {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowDown', isPressed);
    }
  }
}
