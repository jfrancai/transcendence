import { PositionClass } from '../position';
import { CANVA_HEIGHT, CANVA_WIDTH } from './classic-game-param';

export class ClassicCanva extends PositionClass {
  constructor() {
    super(0, 0, CANVA_WIDTH, CANVA_HEIGHT);
    this.dx = 0;
    this.dy = 0;
  }
}
