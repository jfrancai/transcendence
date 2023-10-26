import { PositionClass } from './position';

export class Canva extends PositionClass {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.dx = 0;
    this.dy = 0;
  }
}
