import { DrawPlayer, DrawAura, UpdateOffset, healthHeight, healthOffset, baseHealthWidth } from "./drawing.js";
import { HealthChangeDisplay } from "./healthChangeDisplay.js";
import { gameHeight, gameRunning, gameWidth, healthChangeDisplays, inGame, windowHeight } from "./script.js";
import { DamageAura } from "./weapons.js";

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
    this.canRegenerateShields = true;
    this.canRegenerateShieldsDelay = 7000;
    this.lastHit = 0;
    this.gameStopAddonShields = 0;
    this.shieldRegeneration = 5; // Sp per second regenerated

    this.moveX = 0;
    this.moveY = 0;
    this.pushX = 0;
    this.pushY = 0;

    // --- Attacks ---
    this.aura = new DamageAura(this.effectContext, 390, 20, 1250, "player");

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

  handleShieldRegeneration(currentDeltaTime) {
    // Only update when player has any max shields
    if (this.maxSp <= 0) return;

    // Start regenerating if the time has passed and not if you already can regenerate shields
    if (Date.now() > this.lastHit + this.canRegenerateShieldsDelay + this.gameStopAddonShields && this.canRegenerateShields == false) {
      this.canRegenerateShields = true;
      this.gameStopAddonShields = 0;
    }

    // Update the sp if you can regenerate shields and don't have max sp
    if (this.canRegenerateShields == true && this.sp < this.maxSp) {
      this.sp = Math.min(this.maxSp, this.sp + this.shieldRegeneration * currentDeltaTime);
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
    this.handleShieldRegeneration(currentDeltaTime);

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
    this.aura.handleAura(this.x, this.y, this.aura, "player");
    //TODO Hitting enemies

    DrawAura(x, y, aura.size, aura);
  }

  gotHit(damage, knockback) {
    this.lastHit = Date.now();
    this.canRegenerateShields = false;

    let color = "red";
    if (this.sp > 0 && this.sp > damage) {
      color = "rgb(0, 140, 255)";
    }

    healthChangeDisplays.push(new HealthChangeDisplay(this.x, this.y, damage, this.healthChangeContext, color));

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

window.addEventListener("blur", () => {
  if (inGame == false) return;

  if (gameRunning == true) {
    for (let key in keysDown) {
      keysDown[key] = false;
    }
  }
});
