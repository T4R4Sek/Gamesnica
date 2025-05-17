import { DrawHealingOrb, DrawCoin } from "./drawing.js";
import { playerCoords } from "./player.js";
import { collectibles, gameHeight, gameWidth, player } from "./script.js";

let pickupDistance = 250;

/**
 * @abstract
 */
class Collectible {
  constructor(x, y, context, id) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.id = id;
    this.moveSpeed = 290 + Math.round(Math.random() * 20);
  }

  move(currentDeltaTime) {
    this.x += this.dx * currentDeltaTime;
    this.y += this.dy * currentDeltaTime;

    this.dx *= this.friction;
    this.dy *= this.friction;

    if (Math.abs(this.dx) < 0.0005) this.dx = 0;
    if (Math.abs(this.dy) < 0.0005) this.dy = 0;
  }

  seekPlayer() {
    let dx = playerCoords.x - this.x;
    let dy = playerCoords.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return { dx: dx, dy: dy, distance: distance };
  }

  moveTowardsPlayer(currentDeltaTime, dx, dy, distance) {
    dx /= distance;
    dy /= distance;

    let prudel = 3;
    let speedUp = (prudel + prudel * (1 - distance / pickupDistance)) / prudel;

    this.dx += dx * this.moveSpeed * speedUp * currentDeltaTime * this.magnetStrengthMultiplier;
    this.dy += dy * this.moveSpeed * speedUp * currentDeltaTime * this.magnetStrengthMultiplier;
  }

  checkPlayerCollision() {
    let dx = playerCoords.x - this.x;
    let dy = playerCoords.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= player.size) {
      return true;
    } else {
      return false;
    }
  }

  checkBorderCollision() {
    if (this.x < 0) {
      this.x = 0;
      this.dx *= -1;
    } else if (this.x > gameWidth) {
      this.x = gameWidth;
      this.dx *= -1;
    }

    if (this.y < 0) {
      this.y = 0;
      this.dy *= -1;
    } else if (this.y > gameHeight) {
      this.y = gameHeight;
      this.dy *= -1;
    }
  }

  die() {
    const index = collectibles.findIndex((item) => item.id === this.id);
    if (index !== -1) {
      collectibles.splice(index, 1);
    } else {
      console.error("Could not find the index of collectible: " + this.id);
    }
  }
}

export class HealingOrb extends Collectible {
  constructor(x, y, context, id) {
    super(x, y, context, id);

    let direction = Math.random() * 2 * Math.PI;
    let speed = 100 + Math.floor(Math.random() * 130);
    this.dx = Math.cos(direction) * speed;
    this.dy = Math.sin(direction) * speed;
    this.friction = 0.96;

    this.hpAdd = 30;

    this.magnetStrengthMultiplier = 1;
  }

  checkPlayerCollision() {
    if (player.hp >= player.maxHp) return;

    return super.checkPlayerCollision();
  }

  seekPlayer(currentDeltaTime) {
    let variables = super.seekPlayer();

    if (variables.distance > pickupDistance || player.hp >= player.maxHp) return; //TODO distance > pickupRadius
    this.moveTowardsPlayer(currentDeltaTime, variables.dx, variables.dy, variables.distance);
  }

  die() {
    player.heal(this.hpAdd);
    super.die();
  }

  update(currentDeltaTime) {
    this.seekPlayer(currentDeltaTime);
    this.move(currentDeltaTime);
    this.checkBorderCollision();
    if (this.checkPlayerCollision() == true) this.die();
    DrawHealingOrb(this);
  }
}

export class Coin extends Collectible {
  constructor(x, y, context, id, value) {
    super(x, y, context, id);

    let direction = Math.random() * 2 * Math.PI;
    let speed = 100 + Math.floor(Math.random() * 130);
    this.dx = Math.cos(direction) * speed;
    this.dy = Math.sin(direction) * speed;
    this.friction = 0.96;

    this.coinValue = value;

    this.magnetStrengthMultiplier = 1.5;
  }

  seekPlayer(currentDeltaTime) {
    let variables = super.seekPlayer();

    if (variables.distance > pickupDistance) return; //TODO distance > pickupRadius
    this.moveTowardsPlayer(currentDeltaTime, variables.dx, variables.dy, variables.distance);
  }

  die() {
    player.addCoins(this.coinValue);
    super.die();
  }

  update(currentDeltaTime) {
    this.seekPlayer(currentDeltaTime);
    this.move(currentDeltaTime);
    this.checkBorderCollision();
    if (this.checkPlayerCollision()) this.die();
    DrawCoin(this);
  }
}
