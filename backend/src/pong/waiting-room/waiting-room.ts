import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PongSocket, RoomName, Status, UserID } from '../pong.interface';
import { Game } from '../party/game.abstract';
import { ClassicParty } from '../party/classic-party/classic-party';
import { Player } from '../party/player';
import { Invite } from './invite';

interface PartyConstructor<GameType> {
  new (p1: Player, p2: Player, name: string, io: Server): GameType;
}

export class WaitingRoom {
  private waitingPlayer: PongSocket | undefined;

  private roomName: string = uuid();

  private PartyConstructor: PartyConstructor<Game>;

  private parties: Map<RoomName | UserID, Game> = new Map();

  private invites: Map<UserID, Invite> = new Map();

  constructor(PartyConstructor: PartyConstructor<Game>) {
    this.PartyConstructor = PartyConstructor;
  }

  private isUserWaiting(id: UserID) {
    if (this.waitingPlayer) {
      return id === this.waitingPlayer.id;
    }
    return false;
  }

  isUserInTheWaitingRoom(id: UserID) {
    if (this.waitingPlayer && this.waitingPlayer.user.id === id) {
      return true;
    }
    return this.parties.get(id) !== undefined;
  }

  handleLeaveWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    if (this.isUserWaiting(clientID)) {
      this.waitingPlayer = undefined;
      client.leave(this.roomName);
      client.emit('leaveWaitingRoom');
    }
  }

  isInParty(id: UserID) {
    if (this.getParty(id)) return true;
    return false;
  }

  isInInviteRoom(id: UserID) {
    if (this.getInvite(id)) return true;
    return false;
  }

  handleJoinWaitingRoom(client: PongSocket, io: Server) {
    client.join(this.roomName);
    if (this.waitingPlayer) {
      this.joinParty(this.waitingPlayer, client, io);
      this.waitingPlayer = undefined;
      return false;
    }
    this.waitingPlayer = client;
    client.emit('joinWaitingRoom');
    return true;
  }

  private joinParty(client1: PongSocket, client2: PongSocket, io: Server) {
    const player1 = new Player(client1, 1);
    const player2 = new Player(client2, 2);

    const party = new this.PartyConstructor(
      player1,
      player2,
      this.roomName,
      io
    );
    io.to(party.partyName).emit('joinParty');
    this.parties.set(this.roomName, party);
    this.parties.set(party.player1.id, party);
    this.parties.set(party.player2.id, party);
    this.roomName = uuid();
  }

  getParty(id: RoomName | UserID) {
    return this.parties.get(id);
  }

  private removeParty(id: RoomName | UserID) {
    return this.parties.delete(id);
  }

  getRoomName() {
    return this.roomName;
  }

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let status: Status;
    if (party) {
      client.join(party.partyName);
      if (party.isStarted) {
        status =
          party instanceof ClassicParty
            ? 'CLASSIC_INIT_MATCH'
            : 'SPEED_INIT_MATCH';
      } else if (party.isOver) {
        status =
          party instanceof ClassicParty ? 'CLASSIC_INIT_END' : 'SPEED_INIT_END';
      } else {
        status =
          party instanceof ClassicParty
            ? 'CLASSIC_INIT_READY'
            : 'SPEED_INIT_READY';
      }
      client.emit('connection', status);
    }
  }

  handleRole(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
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

  handleIsPlayerReady(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.isPlayer1(clientID)
        ? party.player1.isReady
        : party.player2.isReady;
    }
    client.emit('isPlayerReady', ready);
  }

  handlePlayerReady(client: PongSocket, isReady: boolean) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    let ready = false;
    if (party) {
      ready = party.togglePlayerReady(clientID, isReady);
      party.startParty(() => {
        party.player1.socket.leave(party.partyName);
        party.player2.socket.leave(party.partyName);
        this.removeParty(party.partyName);
        this.removeParty(party.player2.id);
        this.removeParty(party.player1.id);
      });
    }
    client.emit('playerReady', ready);
  }

  handleArrowUp(client: PongSocket, isPressed: boolean) {
    const party = this.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowUp', isPressed);
    }
  }

  handleArrowDown(client: PongSocket, isPressed: boolean) {
    const party = this.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowDown', isPressed);
    }
  }

  private isInvited(id: UserID, invite: Invite) {
    if (!invite) return false;
    return invite.player2.user.id === id;
  }

  private isInviteCreator(id: UserID, invite: Invite) {
    if (!invite) return false;
    return invite.player1.user.id! === id;
  }

  private getInvite(id: UserID) {
    return this.invites.get(id);
  }

  private deleteInvite(invite: Invite) {
    this.invites.delete(invite.player1.user.id!);
    this.invites.delete(invite.player2.user.id!);
  }

  private createInvite(player1: PongSocket, player2: PongSocket) {
    const invite = new Invite(player1, player2);
    player1.join(invite.partyName);
    this.invites.set(player1.user.id!, invite);
    this.invites.set(player2.user.id!, invite);
  }

  handleCreateInvite(player1: PongSocket, player2: PongSocket): boolean {
    const id1 = player1.user.id!;
    if (this.getParty(id1) || this.getInvite(id1)) return false;
    this.createInvite(player1, player2);
    player1.emit('playerInvited');
    player2.emit('invite', {
      mode: this.PartyConstructor === ClassicParty ? 'classic' : 'speed',
      username: player1.user.username
    });
    return true;
  }

  handleDestroyInvite(player1: PongSocket, player2: PongSocket): boolean {
    const id = player1.user.id!;
    const invite = this.getInvite(id);
    if (invite && this.isInviteCreator(id, invite)) {
      this.deleteInvite(invite);
      player2.emit('inviteDestroy');
      return true;
    }
    return false;
  }

  handleAcceptInvite(player2: PongSocket, io: Server): boolean {
    const id = player2.user.id!;
    const invite = this.getInvite(id);
    if (invite && this.isInvited(id, invite)) {
      invite.player1.emit('inviteAccept');
      player2.join(invite.partyName);
      this.joinParty(invite.player1, player2, io);
      this.deleteInvite(invite);
      return true;
    }
    return false;
  }

  handleDenyInvite(player2: PongSocket): boolean {
    const id = player2.user.id!;
    const invite = this.getInvite(id);
    if (invite && this.isInvited(id, invite)) {
      invite.player1.emit('inviteDenied');
      this.deleteInvite(invite);
      return true;
    }
    return false;
  }
}
