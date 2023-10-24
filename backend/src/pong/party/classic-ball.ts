import { BALLSIZE, CLASSIC_BALL_SPEED } from './classic-game-param';
import { Ball } from './ball';
import { Canva } from './canva';
import { Game } from './game';
import { Paddle } from './paddle';

// This ball can be used inside ClassicParty. It has
// default behavior and constant speed of BALL_SPEED

export class ClassicBall extends Ball {
  constructor() {
    super(BALLSIZE / 2, CLASSIC_BALL_SPEED);
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.dx = Math.random() < 0.5 ? -1 : 1;
  }

  updatePosition(paddle1: Paddle, paddle2: Paddle, canva: Canva, game: Game) {
    // gere la collision des parois hautes et basses
    if (
      this.y + this.height >= canva.height + this.radius ||
      this.y <= this.radius
    ) {
      this.dy = -this.dy;
    }

    // collision paroi droite
    if (this.x + this.radius >= canva.width) {
      // this.logger.log('Joueur gauche a marque 1 Point !!!!!!!!!!!!');
      game.incScore1();
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    // collision paroi gauche
    if (this.x <= this.radius) {
      // this.logger.log('joueur droit a marque 1 Point !!!!!!!!!!!!');
      game.incScore2();
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    // collisions raquette gauche
    if (this.x <= paddle1.x + paddle1.width + this.radius) {
      if (
        this.y >= paddle1.y &&
        this.y + this.height <= paddle1.y + paddle1.height
      ) {
        this.dx = 1;
      }
    }

    // collisions raquette droite
    if (this.x + this.width >= paddle2.x + this.radius) {
      if (
        this.y >= paddle2.y + this.radius &&
        this.y + this.height <= paddle2.y + paddle2.height + this.radius
      ) {
        this.dx = -1;
      }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}
