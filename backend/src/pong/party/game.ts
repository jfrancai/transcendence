import { Player } from './player';

export abstract class Game {
  partyName: string;

  isStarted: boolean = false;

  isOver: boolean = false;

  // Player1
  player1: Player;

  public scorePlayer1: number = 0;

  // Player2
  player2: Player;

  public scorePlayer2: number = 0;

  constructor(p1: Player, p2: Player, name: string) {
    this.player1 = p1;
    this.player2 = p2;
    this.partyName = name;
  }

  abstract movePaddle(
    playerId: string,
    keycode: string,
    isPressed: boolean
  ): void;

  abstract incScore1(): void;

  abstract incScore2(): void;

  abstract startParty(clearParty: () => void): void;
}
