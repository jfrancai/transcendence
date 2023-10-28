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

  protected roomName: string = uuid();

  protected PartyConstructor: PartyConstructor<Game>;

  protected parties: Map<RoomName | UserID, Game> = new Map();

  protected invites: Map<UserID, Invite> = new Map();

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

  handleJoinWaitingRoom(client: PongSocket, io: Server) {
    const clientID = client.user.id!;
    const party = this.getParty(clientID);
    if (party || this.invites.get(client.user.id!)) return;

    client.join(this.roomName);
    if (this.waitingPlayer) {
      this.joinParty(this.waitingPlayer, client, io);
      this.waitingPlayer = undefined;
    }
    this.waitingPlayer = client;
    client.emit('joinWaitingRoom');
  }

  protected joinParty(client1: PongSocket, client2: PongSocket, io: Server) {
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

  protected getParty(id: RoomName | UserID) {
    return this.parties.get(id);
  }

  protected removeParty(id: RoomName | UserID) {
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
    return invite.idInvited === id;
  }

  private isInviteCreator(id: UserID, invite: Invite) {
    if (!invite) return false;
    return invite.playerInviting.user.id! === id;
  }

  private getInvite(id: UserID) {
    return this.invites.get(id);
  }

  private deleteInvite(invite: Invite) {
    this.invites.delete(invite.idInvited);
    this.invites.delete(invite.playerInviting.user.id!);
  }

  handleCreateInvite(client: PongSocket, idInvited: UserID) {
    const id = client.user.id!;
    if (this.getParty(id) === undefined && this.getInvite(id) === undefined) {
      const invite = new Invite(client, idInvited);

      client.join(invite.partyName);

      this.invites.set(id, invite);
      this.invites.set(idInvited, invite);
    }
  }

  handleDestroyInvite(client: PongSocket) {
    const id = client.user.id!;
    const invite = this.invites.get(id);
    if (invite && this.isInviteCreator(id, invite)) {
      this.invites.delete(invite.idInvited);
      this.invites.delete(invite.playerInviting.user.id!);
    }
  }

  handleAcceptInvite(client: PongSocket, io: Server) {
    const id = client.user.id!;
    const invite = this.invites.get(id);
    if (invite && invite.idInvited === id) {
      client.join(invite.partyName);
      this.joinParty(invite.playerInviting, client, io);
    }
  }

  handleDenyInvite(client: PongSocket) {
    const id = client.user.id!;
    const invite = this.invites.get(id);
    if (invite && invite.idInvited === id) {
      invite.playerInviting.emit('inviteDenied');
      this.deleteInvite(invite);
    }
  }
}
