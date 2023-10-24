import { Canva } from './canva';
import {
  BALLSIZE,
  BALL_SPEED,
  CANVA_HEIGHT,
  CANVA_WIDTH
} from './classic-game-param';
import { Game } from './game';
import { Paddle } from './paddle';
import { PositionClass } from './position';

export abstract class Ball extends PositionClass {
  protected speed: number = BALL_SPEED;

  public radius: number = BALLSIZE;

  constructor(radius: number, speed: number) {
    const x = CANVA_WIDTH / 2;
    const y = CANVA_HEIGHT / 2;
    const w = BALLSIZE;
    const h = BALLSIZE;
    super(x, y, w, h);
    this.radius = radius;
    this.speed = speed;
  }

  abstract updatePosition(
    paddle1: Paddle,
    paddle2: Paddle,
    canva: Canva,
    game: Game
  ): void;
}
