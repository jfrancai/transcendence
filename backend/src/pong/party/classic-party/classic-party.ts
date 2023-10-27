import { Player } from '../player';
import { Game } from '../game.abstract';
import { GameState } from '../../pong.interface';
import { ClassicCanva } from './classic-canva';
import { ClassicLeftPaddle } from './classic-left-paddle';
import { ClassicRightPaddle } from './classic-right-paddle';
import {
  BALLSIZE,
  CANVA_HEIGHT,
  CANVA_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  VICTORY_POINT,
  WALL_OFFSET
} from './classic-game-param';
import { ClassicBall } from './classic-ball';

export class ClassicParty extends Game {
  constructor(p1: Player, p2: Player, name: string) {
    super(p1, p2, VICTORY_POINT, name);
    this.canva = new ClassicCanva();
    this.ball = new ClassicBall(this);
    this.paddle1 = new ClassicLeftPaddle();
    this.paddle2 = new ClassicRightPaddle();
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
