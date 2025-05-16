import { DrawHealingOrb } from "./drawing.js";

export class HealingOrb {
  constructor(x, y, context) {
    this.x = x;
    this.y = y;
    this.context = context;
  }

  update() {
    DrawHealingOrb(this);
  }
}
