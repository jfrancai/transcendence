import { Server } from 'socket.io';
import { Ball } from './ball.abstract';
import { Player } from './player';
import { GameState } from '../pong.interface';
import { Paddle } from './paddle.abstract';
import { PositionClass } from './position';

export abstract class Game {
  protected io: Server;

  public partyName: string;

  public isStarted: boolean = false;

  public isOver: boolean = false;

  public maxScore: number;

  // Player1
  public player1: Player;

  public scorePlayer1: number = 0;

  // Player2
  public player2: Player;

  public scorePlayer2: number = 0;

  public playerWon: number;
  // Game element

  protected ball: Ball;

  protected paddle2: Paddle;

  protected paddle1: Paddle;

  protected canva: PositionClass;

  constructor(
    p1: Player,
    p2: Player,
    winCondition: number,
    name: string,
    io: Server
  ) {
    this.player1 = p1;
    this.player2 = p2;
    this.playerWon = 0;
    this.partyName = name;
    this.io = io;
    this.maxScore = winCondition;
  }

  public isPlayer1(playerId: string) {
    return this.player1.socket.user.id === playerId;
  }

  public isPlayerReady(playerId: string) {
    if (playerId === this.player1.socket.user.id) {
      return this.player1.isReady;
    }
    return this.player2.isReady;
  }

  public togglePlayerReady(playerId: string, isReady: boolean) {
    if (playerId === this.player1.socket.user.id) {
      this.player1.isReady = isReady;
      return this.player1.isReady;
    }
    this.player2.isReady = isReady;
    return this.player2.isReady;
  }

  public startParty(clearParty: () => void) {
    if (this.player1.isReady && this.player2.isReady) {
      if (this.isStarted === false) {
        this.startGameLoop(clearParty);
      }
      this.startBroadcastingGameState();
      this.io.to(this.partyName).emit('startGame', this.partyName);
    }
  }

  public movePaddle(playerId: string, keycode: string, isPressed: boolean) {
    if (playerId === this.player1.socket.user.id) {
      this.paddle1.setActive(keycode, isPressed);
    } else {
      this.paddle2.setActive(keycode, isPressed);
    }
  }

  public incScore1() {
    this.scorePlayer1 += 1;
  }

  public incScore2() {
    this.scorePlayer2 += 1;
  }

  private startGameLoop(clearParty: () => void): void {
    this.isStarted = true;
    const gameInterval = setInterval(() => {
      this.ball.updatePosition(this.paddle1, this.paddle2, this.canva);
      this.paddle1.updatePosition(this.canva);
      this.paddle2.updatePosition(this.canva);
      if (
        this.scorePlayer1 >= this.maxScore ||
        this.scorePlayer2 >= this.maxScore
      ) {
        this.io.to(this.partyName).emit('gameOver', true);
<<<<<<< HEAD:backend/src/pong/party/party.ts
        this.playerWon = this.scorePlayer1 >= VICTORY_POINT ? 1 : 2;
=======
        this.playerWon = this.scorePlayer1 >= this.maxScore ? 1 : 2;
>>>>>>> main:backend/src/pong/party/game.abstract.ts
        clearParty();
        this.isOver = true;
        clearInterval(gameInterval);
      }
    }, 8);
  }

  private startBroadcastingGameState(): void {
    const broadcastInterval = setInterval(() => {
      if (this.isOver) {
        clearInterval(broadcastInterval);
      }
      const gameState: GameState = {
        ball: {
          x: this.ball.x,
          y: this.ball.y,
          radius: this.ball.radius
        },
        rightPaddle: {
          x: this.paddle1.x,
          y: this.paddle1.y,
          width: this.paddle1.width,
          height: this.paddle1.height
        },
        leftPaddle: {
          x: this.paddle2.x,
          y: this.paddle2.y,
          width: this.paddle2.width,
          height: this.paddle2.height
        },
        canva: this.canva,
        scorePlayer1: this.scorePlayer1,
        scorePlayer2: this.scorePlayer2,
        maxScore: this.maxScore
      };
      this.io.to(this.partyName).emit('gameState', gameState);
    }, 8);
  }
}
