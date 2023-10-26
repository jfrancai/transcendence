import { Server } from 'socket.io';
import { Canva } from './canva';
import { Player } from './player';
import { Game } from './game';
import { Paddle } from './paddle';
import { Ball } from './ball';
import {
  BALLSIZE,
  CANVA_HEIGHT,
  CANVA_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  VICTORY_POINT,
  WALL_OFFSET
} from './classic-game-param';

interface Position {
  x: number;
  y: number;
}

interface PaddleShape extends Position {
  width: number;
  height: number;
}

interface CanvaShape {
  width: number;
  height: number;
}

interface GameState {
  ball: Position;
  leftPaddle: PaddleShape;
  rightPaddle: PaddleShape;
  canva: CanvaShape;
  scorePlayer1: number;
  scorePlayer2: number;
  maxScore: number;
}

export class PartyClassic extends Game {
  private ball: Ball;

  private paddle2: Paddle;

  private paddle1: Paddle;

  private canva: Canva;

  private io: Server;

  public playerWon: number;

  constructor(p1: Player, p2: Player, name: string, io: Server) {
    super(p1, p2, name);
    this.io = io;
    this.playerWon = 0;
    this.canva = new Canva(0, 0, CANVA_WIDTH, CANVA_HEIGHT);

    this.ball = new Ball(
      CANVA_WIDTH / 2 - BALLSIZE / 2,
      CANVA_HEIGHT / 2 - BALLSIZE / 2,
      BALLSIZE,
      BALLSIZE
    );
    this.paddle1 = new Paddle(
      WALL_OFFSET,
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    this.paddle2 = new Paddle(
      CANVA_WIDTH - (WALL_OFFSET + PADDLE_WIDTH),
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
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

  public togglePlayerReady(playerId: string) {
    if (playerId === this.player1.socket.user.id) {
      this.player1.isReady = !this.player1.isReady;
      return this.player1.isReady;
    }
    this.player2.isReady = !this.player2.isReady;
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

  public static getInitGameState(): GameState {
    return {
      ball: {
        x: CANVA_WIDTH / 2 - BALLSIZE / 2,
        y: CANVA_HEIGHT / 2 - BALLSIZE / 2
      },
      leftPaddle: {
        x: WALL_OFFSET,
        y: CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
      },
      rightPaddle: {
        x: CANVA_WIDTH - (WALL_OFFSET + PADDLE_WIDTH),
        y: CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
      },
      canva: {
        width: CANVA_WIDTH,
        height: CANVA_HEIGHT
      },
      scorePlayer1: 0,
      scorePlayer2: 0,
      maxScore: VICTORY_POINT
    };
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
      this.ball.updatePosition(this.paddle1, this.paddle2, this.canva, this);
      this.paddle1.updatePosition(this.canva);
      this.paddle2.updatePosition(this.canva);
      if (
        this.scorePlayer1 >= VICTORY_POINT ||
        this.scorePlayer2 >= VICTORY_POINT
      ) {
        this.io.to(this.partyName).emit('gameOver', true);
        this.playerWon = this.scorePlayer1 >= VICTORY_POINT ? 1 : 2;
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
          y: this.ball.y
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
        maxScore: VICTORY_POINT
      };
      this.io.to(this.partyName).emit('gameState', gameState);
    }, 8);
  }
}
