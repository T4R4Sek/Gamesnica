import { baseHealthWidth, DrawTextDisplay, healthHeight, healthOffset } from "./drawing.js";
import { ctx4, healthChangeDisplays, player, windowHeight, windowWidth } from "./script.js";

export let healthChangeDisplayNextId = 0;

export class HealthChangeDisplay {
  constructor(x, y, amount, context, strokeStyle, staticPosition) {
    this.staticPosition = staticPosition;
    this.staticPosition == true ? null : (this.staticPosition = false);
    this.x = x;
    this.y = y;
    this.text = Math.round(amount);
    this.strokeStyle = strokeStyle;

    this.context = context;

    this.id = healthChangeDisplayNextId++;
    this.age = 0;
    this.maxAge = 1.3;

    this.dx = Math.random() * 100 - 50;
    this.dy = -20 + Math.random() * -8;
    this.friction = 2; // How much momentum lost per second (1 == ~100% lost)
  }

  move(currentDeltaTime) {
    this.x += this.dx * currentDeltaTime;
    this.y += this.dy * currentDeltaTime;

    this.dx -= this.dx * this.friction * currentDeltaTime;
  }

  die() {
    const index = healthChangeDisplays.findIndex((item) => item.id === this.id);
    if (index !== -1) {
      healthChangeDisplays.splice(index, 1);
    } else {
      console.error("Could not find the index of damageDisplay: " + this.id);
    }
  }

  update(currentDeltaTime) {
    // If age is below half max age, then opacity is 1, then it lineary decreases until its 0
    let opacity = Math.min(1, 2 * (1 - this.age / this.maxAge));

    this.move(currentDeltaTime);
    DrawTextDisplay(this.x, this.y, this.text, this.context, opacity, this.strokeStyle, this.staticPosition);

    this.age += currentDeltaTime;
    if (this.age > this.maxAge) this.die();
  }
}
