import { Ball } from '../ball.abstract';
import { Game } from '../game.abstract';
import { Paddle } from '../paddle.abstract';
import { PositionClass } from '../position';
import { BALLSIZE, BALL_SPEED } from './classic-game-param';

export class ClassicBall extends Ball {
  private game: Game;

  constructor(game: Game) {
    super(BALLSIZE / 2, BALL_SPEED);
    this.game = game;
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.dx = Math.random() < 0.5 ? -1 : 1;
  }

  updatePosition(paddle1: Paddle, paddle2: Paddle, canva: PositionClass) {
    // gere la collision des parois hautes et basses
    if (this.y + this.radius >= canva.height || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    // collisions raquette gauche
    if (this.x - this.radius <= paddle1.x + paddle1.width) {
      if (
        this.y + this.radius >= paddle1.y &&
        this.y - this.radius <= paddle1.y + paddle1.height
      ) {
        this.dx = 1;
      } else {
        this.game.incScore1();
        this.x = canva.width / 2;
        this.y = canva.height / 2;
      }
    }

    // collisions raquette droite
    if (this.x + this.radius >= paddle2.x) {
      if (
        this.y + this.radius >= paddle2.y &&
        this.y - this.radius <= paddle2.y + paddle2.height
      ) {
        this.dx = -1;
      } else {
        this.game.incScore2();
        this.x = canva.width / 2;
        this.y = canva.height / 2;
      }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}
