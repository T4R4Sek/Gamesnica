import { DrawPlayer, DrawAura } from "./drawing.js";
import { gameHeight, gameWidth } from "./script.js";
const keysDown = { w: false, s: false, a: false, d: false };
export const playerCoords = { x: 0, y: 0 };

export class Player {
  constructor(mainContext, effectContext) {
    this.mainContext = mainContext;
    this.effectContext = effectContext;

    this.x = gameWidth * 0.5;
    this.y = gameHeight * 0.5;
    this.size = 30;
    this.fillColor = "rgb(221, 221, 221)";
    this.strokeColor = "rgb(156, 156, 156)";
    this.speed = 150;

    this.maxHp = 100;
    this.hp = this.maxHp;
    this.maxSp = 100;
    this.sp = this.maxSp;

    this.moveX = 0;
    this.moveY = 0;
    this.pushX = 0;
    this.pushY = 0;

    // Attacks
    this.aura = {
      baseSize: 400,
      baseDamage: 20,
      fillColor: "red",
      strokeColor: "red",
    };
  }

  move(currentDeltaTime) {
    this.x += (this.moveX * this.speed + this.pushX) * currentDeltaTime;
    this.y += (this.moveY * this.speed + this.pushY) * currentDeltaTime;
  }

  handleKeys() {
    if (keysDown.w && !keysDown.s) {
      if (keysDown.a && !keysDown.d) {
        // UP and LEFT
        this.moveX = -0.707;
        this.moveY = -0.707;
      } else if (keysDown.d && !keysDown.a) {
        // UP and RIGHT
        this.moveX = 0.707;
        this.moveY = -0.707;
      } else {
        // UP only
        this.moveX = 0;
        this.moveY = -1;
      }
    } else if (keysDown.s && !keysDown.w) {
      if (keysDown.a && !keysDown.d) {
        // DOWN and LEFT
        this.moveX = -0.707;
        this.moveY = 0.707;
      } else if (keysDown.d && !keysDown.a) {
        // DOWN and RIGHT
        this.moveX = 0.707;
        this.moveY = 0.707;
      } else {
        // DOWN only
        this.moveX = 0;
        this.moveY = 1;
      }
    } else if (keysDown.a && !keysDown.d) {
      // LEFT only
      this.moveX = -1;
      this.moveY = 0;
    } else if (keysDown.d && !keysDown.a) {
      // RIGHT only
      this.moveX = 1;
      this.moveY = 0;
    } else {
      // NOTHING
      this.moveX = 0;
      this.moveY = 0;
    }
  }

  handleBorderCollision() {
    // Left and right
    if (this.x - this.size < 0) this.x = this.size;
    else if (this.x + this.size > gameWidth) this.x = gameWidth - this.size;

    // Top and bottom
    if (this.y - this.size < 0) this.y = this.size;
    else if (this.y + this.size > gameHeight) this.y = gameHeight - this.size;
  }

  update(currentDeltaTime) {
    this.handleKeys();
    this.move(currentDeltaTime);
    this.handleBorderCollision();

    if (this.aura != null)
      this.handleAura(this.effectContext, this.x, this.y, this.aura);

    playerCoords.x = this.x;
    playerCoords.y = this.y;
    DrawPlayer(
      this.x,
      this.y,
      this.size,
      this.fillColor,
      this.strokeColor,
      this.mainContext
    );
  }

  handleAura(context, x, y, auraProps) {
    let size = auraProps.baseSize; //TODO stacking buffs
    //TODO Hitting enemies

    DrawAura(context, x, y, size, auraProps.fillColor, auraProps.strokeColor);
  }

  reset() {
    // Reset stats code
  }
}

document.addEventListener("keydown", (event) => {
  // console.log("DOWN: " + event.key);
  switch (event.key) {
    case "w":
    case "ArrowUp":
      keysDown.w = true;
      break;

    case "s":
    case "ArrowDown":
      keysDown.s = true;
      break;

    case "a":
    case "ArrowLeft":
      keysDown.a = true;
      break;

    case "d":
    case "ArrowRight":
      keysDown.d = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  // console.log("UP: " + event.key);
  switch (event.key) {
    case "w":
    case "ArrowUp":
      keysDown.w = false;
      break;

    case "s":
    case "ArrowDown":
      keysDown.s = false;
      break;

    case "a":
    case "ArrowLeft":
      keysDown.a = false;
      break;

    case "d":
    case "ArrowRight":
      keysDown.d = false;
      break;
  }
});
