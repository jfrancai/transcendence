import { Game } from '../party/game.abstract';
import { Player } from '../party/player';
import { PongSocket, UserID } from '../pong.interface';
import { WaitingRoom } from './waiting-room';

interface PartyConstructor<GameType> {
  new (p1: Player, p2: Player, name: string): GameType;
}

export class InviteWaitingRoom extends WaitingRoom {
  private player1: PongSocket;

  private player2: PongSocket;

  constructor(
    player1Socket: PongSocket,
    PartyConstructor: PartyConstructor<Game>
  ) {
    super(PartyConstructor);
    this.player1 = player1Socket;
    player1Socket.emit('joinWaitingRoom');
  }

  private isUserWaiting(id: UserID) {
    if (this.player1) {
      return id === this.player1.id;
    }
    return false;
  }

  handleLeaveWaitingRoom(client: PongSocket): void {
    const clientID = client.user.id!;
    if (this.isUserWaiting(clientID)) {
      client.emit('leaveWaitingRoom');
    }
  }

  handleJoinWaitingRoom(client: PongSocket): void {
    client.join(this.roomName);
    this.joinParty(this.player1, client);
  }
}
