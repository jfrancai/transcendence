import { Player } from '../player';
import { Game } from '../game.abstract';
import { GameState } from '../../pong.interface';
import {
  BALLSIZE,
  CANVA_HEIGHT,
  CANVA_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  VICTORY_POINT,
  WALL_OFFSET
} from './speed-ball-game-param';
import { SpeedCanva } from './speed-canva';
import { SpeedBall } from './speed-ball';
import { SpeedLeftPaddle } from './speed-left-paddle';
import { SpeedRightPaddle } from './speed-right-paddle';

export class SpeedParty extends Game {
  constructor(p1: Player, p2: Player, name: string) {
    super(p1, p2, VICTORY_POINT, name);
    this.canva = new SpeedCanva();
    this.ball = new SpeedBall(this);
    this.paddle1 = new SpeedLeftPaddle();
    this.paddle2 = new SpeedRightPaddle();
  }

  public static getInitGameState(): GameState {
    return {
      ball: {
        x: CANVA_WIDTH / 2,
        y: CANVA_HEIGHT / 2,
        radius: BALLSIZE / 2
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
}
