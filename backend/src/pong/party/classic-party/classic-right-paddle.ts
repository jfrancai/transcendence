import { Paddle } from '../paddle.abstract';
import {
  CANVA_HEIGHT,
  CANVA_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  WALL_OFFSET
} from './classic-game-param';

export class ClassicRightPaddle extends Paddle {
  constructor() {
    super(
      CANVA_WIDTH - (WALL_OFFSET + PADDLE_WIDTH),
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
  }
}
