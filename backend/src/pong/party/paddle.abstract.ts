import { ClassicCanva } from './classic-party/classic-canva';
import { PADDLE_SPEED } from './classic-party/classic-game-param';
import { PositionClass } from './position';

interface PaddleState {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export abstract class Paddle extends PositionClass {
  private isDownActive: boolean = false;

  private isUpActive: boolean = false;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.dx = 0;
    this.dy = 0;
  }

  getPaddleState(): PaddleState {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      dy: this.dy
    };
  }

  setActive(keycode: string, pressed: boolean) {
    if (keycode === 'ArrowDown' && pressed) {
      this.isDownActive = true;
    } else if (keycode === 'ArrowDown' && !pressed) {
      this.isDownActive = false;
    } else if (keycode === 'ArrowUp' && pressed) {
      this.isUpActive = true;
    } else if (keycode === 'ArrowUp' && !pressed) {
      this.isUpActive = false;
    }
  }

  updatePosition(canva: ClassicCanva) {
    if (this.isUpActive && !this.isDownActive) {
      this.dy = -1;
      if (this.y < 0) {
        this.y = 0;
      }
    } else if (this.isDownActive && !this.isUpActive) {
      this.dy = 1;
      if (this.y + this.height > canva.height) {
        this.y = canva.height - this.height;
      }
    } else {
      this.dy = 0;
    }
    this.y += this.dy * PADDLE_SPEED;
  }
}
