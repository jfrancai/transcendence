import { Paddle } from '../paddle.abstract';
import {
  CANVA_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  WALL_OFFSET
} from './classic-game-param';

export class ClassicLeftPaddle extends Paddle {
  constructor() {
    super(
      WALL_OFFSET,
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
  }
}
