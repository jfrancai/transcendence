import { PongSocket, UserID } from '../pong.interface';
import { WaitingRoom } from './waiting-room';

export class PublicWaitingRoom extends WaitingRoom {
  private waitingPlayer: PongSocket | undefined;

  private isUserWaiting(id: UserID) {
    if (this.waitingPlayer) {
      return id === this.waitingPlayer.id;
    }
    return false;
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    if (this.isUserWaiting(clientID)) {
      this.waitingPlayer = undefined;
      client.emit('leaveWaitingRoom');
    }
  }

  handleJoinWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    if (party) return;

    client.join(this.roomName);
    if (this.waitingPlayer) {
      this.joinParty(this.waitingPlayer, client);
      this.waitingPlayer = undefined;
    }
    this.waitingPlayer = client;
    client.emit('joinWaitingRoom');
  }
}
