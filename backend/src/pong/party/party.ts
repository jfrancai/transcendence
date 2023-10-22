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

export class PartyClassic extends Game {
  private ball: Ball;

  private paddle2: Paddle;

  private paddle1: Paddle;

  private canva: Canva;

  constructor(p1: Player, p2: Player, name: string) {
    super(p1, p2, name);
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

  movePaddle(playerId: string, keycode: string, isPressed: boolean) {
    if (playerId === this.player1.socket.user.id) {
      this.paddle1.setActive(keycode, isPressed);
    } else {
      this.paddle2.setActive(keycode, isPressed);
    }
  }

  public static getInitGameState() {
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
      scorePlayer2: 0
    };
  }

  startBroadcastingBallState(
    emitState: (state: any) => void,
    emitGameOver: () => void
  ): void {
    this.isStarted = true;
    const gameInterval = setInterval(() => {
      this.ball.updatePosition(this.paddle1, this.paddle2, this.canva, this);
      this.paddle1.updatePosition(this.canva);
      this.paddle2.updatePosition(this.canva);
      if (
        this.scorePlayer1 >= VICTORY_POINT ||
        this.scorePlayer2 >= VICTORY_POINT
      ) {
        emitGameOver();
        this.isStarted = false;
        clearInterval(gameInterval);
      }
      const gameState = {
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
        scorePlayer2: this.scorePlayer2
      };
      emitState(gameState);
    }, 8);
  }
}
