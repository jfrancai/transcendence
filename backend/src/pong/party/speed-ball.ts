import {
  ACCELERATION,
  BALLSIZE,
  SPEED_BALL_BALL_SPEED
} from './classic-game-param';
import { Ball } from './ball';
import { Canva } from './canva';
import { Game } from './game';
import { Paddle } from './paddle';

// This ball can be used inside ClassicParty. It has
// default behavior and an increasing speed of ACCELERATION on
// each paddle bounce.

export class SpeedBall extends Ball {
  private defaultSpeed: number;

  constructor() {
    super(BALLSIZE / 2, SPEED_BALL_BALL_SPEED);
    this.defaultSpeed = SPEED_BALL_BALL_SPEED;
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.dx = Math.random() < 0.5 ? -1 : 1;
  }

  updatePosition(paddle1: Paddle, paddle2: Paddle, canva: Canva, game: Game) {
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
        this.speed *= ACCELERATION;
        this.dx = 1;
      } else {
        game.incScore1();
        this.x = canva.width / 2;
        this.y = canva.height / 2;
        this.speed = this.defaultSpeed;
      }
    }

    // collisions raquette droite
    if (this.x + this.radius >= paddle2.x) {
      if (
        this.y + this.radius >= paddle2.y &&
        this.y - this.radius <= paddle2.y + paddle2.height
      ) {
        this.speed *= ACCELERATION;
        this.dx = -1;
      } else {
        game.incScore2();
        this.x = canva.width / 2;
        this.y = canva.height / 2;
        this.speed = this.defaultSpeed;
      }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}
