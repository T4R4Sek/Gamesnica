import { AuraAttack } from "./attacks.js";
import { DrawPlayer, DrawAura, UpdateOffset } from "./drawing.js";
import { HealthChangeDisplay } from "./healthChangeDisplay.js";
import { gameHeight, gameWidth, healthChangeDisplays } from "./script.js";
import { Aura } from "./weapons.js";

const keysDown = { w: false, s: false, a: false, d: false };
export const playerCoords = { x: 0, y: 0 };

/**
 * The player class
 *
 * @param {CanvasRenderingContext2D} mainContext - Is used to draw the player model
 * @param {CanvasRenderingContext2D} effectContext - Is used for certain effects (like Aura)
 * @param {CanvasRenderingContext2D} healthChangeContext - Is used for health change display
 */
export class Player {
  constructor(mainContext, effectContext, healthChangeContext) {
    this.mainContext = mainContext;
    this.effectContext = effectContext;
    this.healthChangeContext = healthChangeContext;

    this.x = gameWidth * 0.5;
    this.y = gameHeight * 0.5;
    this.size = 30;
    this.fillColor = "rgb(221, 221, 221)";
    this.strokeColor = "rgb(156, 156, 156)";
    this.speed = 250;

    this.maxHp = 100;
    this.hp = this.maxHp;
    this.maxSp = 100;
    this.sp = this.maxSp;

    this.moveX = 0;
    this.moveY = 0;
    this.pushX = 0;
    this.pushY = 0;

    // --- Attacks ---
    this.aura = new Aura(this.effectContext, 250, 30, "rgb(70, 243, 255)", 0.15, 0.4, "rgb(70, 203, 255)", 1000);

    // Coins
    this.coins = 20;
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

    playerCoords.x = this.x;
    playerCoords.y = this.y;

    UpdateOffset(playerCoords.x, playerCoords.y);

    if (this.aura != null || !(this.aura === undefined)) {
      this.handleAura(this.x, this.y, this.aura);
    }

    DrawPlayer(this.x, this.y, this.size, this.fillColor, this.strokeColor, this.mainContext);
  }

  handleAura(x, y, aura) {
    let size = aura.size; //TODO Stacking buffs
    let damage = aura.baseDamage; //TODO Stacking buffs
    AuraAttack(this.x, this.y, size, damage, this.aura, "enemies");
    //TODO Hitting enemies

    DrawAura(x, y, size, aura);
  }

  gotHit(damage, knockback) {
    if (this.sp > damage) {
      this.sp -= damage;
    } else if (this.sp > 0 && this.sp <= damage) {
      damage -= this.sp;
      this.hp -= damage;

      this.sp = 0;
    } else this.hp = Math.max(this.hp - damage, 0);
    if (this.hp <= 0) this.die();
  }

  heal(amount) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
    healthChangeDisplays.push(new HealthChangeDisplay(this.x, this.y, amount, this.healthChangeContext, "rgb(0, 255, 0)"));
  }

  addCoins(amount) {
    this.coins += amount;
    console.log("Coins: " + this.coins);
  }

  die() {
    console.warn("Player died");
  }

  reset() {
    //TODO Reset stats code
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
