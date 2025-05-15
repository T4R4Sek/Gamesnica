import { DrawEnemy } from "./drawing.js";
import { gameHeight, gameWidth, enemies } from "./script.js";
import { playerCoords } from "./player.js";

export class Enemy {
  constructor(context, context2, id, x, y, size, fillColor, strokeColor, speed, shape, behavior) {
    this.context = context;
    this.context2 = context2;
    this.id = id;

    this.x = x;
    this.y = y;
    this.size = size * (0.75 + Math.random() * 0.5);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.maxSpeed = speed * 5;
    this.speed = this.maxSpeed;
    this.turnSpeed = Math.PI / 100;
    this.shape = shape;
    this.behavior = behavior;

    this.maxHp = 100;
    // this.hp = this.maxHp;
    this.hp = Math.round(Math.random() * 100);

    let vectorX = playerCoords.x - this.x;
    let vectorY = playerCoords.y - this.y;
    let vectorMagnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    this.moveX = vectorX / vectorMagnitude;
    this.moveY = vectorY / vectorMagnitude;

    this.pushX = 0;
    this.pushY = 0;

    this.render = true;
    this.active = true;
  }

  chaseTarget() {
    if (this.behavior == "chasePlayer") {
      let vectorX = playerCoords.x - this.x;
      let vectorY = playerCoords.y - this.y;
      let vectorMagnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

      let vx = vectorX / vectorMagnitude;
      let vy = vectorY / vectorMagnitude;

      this.steerVector(this.moveX, this.moveY, vx, vy, this.turnSpeed);
    }
  }

  move(currentDeltaTime) {
    this.x += (this.moveX * this.speed + this.pushX) * currentDeltaTime;
    this.y += (this.moveY * this.speed + this.pushY) * currentDeltaTime;
  }

  handleBorderCollision() {
    // Left and right
    if (this.x - this.size < 0) this.x = this.size;
    else if (this.x + this.size > gameWidth) this.x = gameWidth - this.size;

    // Top and bottom
    if (this.y - this.size < 0) this.y = this.size;
    else if (this.y + this.size > gameHeight) this.y = gameHeight - this.size;
  }

  checkAllyProximity() {
    enemies.forEach((ally) => {
      if (this.id == ally.id || ally.active == false) return; // Possibly better optimalization

      let dx = this.x - ally.x;
      let dy = this.y - ally.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + ally.size) {
        let px = dx / distance;
        let py = dy / distance;

        let pushStrength = ((this.size + ally.size) / distance) * 1.5 - 1.5;
        // pushStrength = Math.max(0.1, pushStrength);

        this.x += px * pushStrength;
        this.y += py * pushStrength;

        ally.x -= px * pushStrength;
        ally.y -= py * pushStrength;
      }
    });
  }

  draw() {
    if (this.render) {
      DrawEnemy(this.x, this.y, this.size, this.shape, this.fillColor, this.strokeColor, this.context, this.hp, this.maxHp, this.context2);
    }
  }

  steerVector(currentX, currentY, desiredX, desiredY, turnSpeed) {
    const currentLen = Math.hypot(currentX, currentY);
    const desiredLen = Math.hypot(desiredX, desiredY);

    // Normalize input vectors
    const ax = currentX / currentLen;
    const ay = currentY / currentLen;
    const bx = desiredX / desiredLen;
    const by = desiredY / desiredLen;

    // Compute angle between vectors
    const dot = ax * bx + ay * by;
    const angle = Math.acos(Math.min(Math.max(dot, -1), 1)); // clamp for safety

    if (angle < 1e-5 || angle <= turnSpeed) {
      // Already close enough — snap to desired
      return [bx, by];
    }

    // Determine rotation direction using 2D cross product
    const cross = ax * by - ay * bx;
    const direction = cross > 0 ? 1 : -1;
    const angleToRotate = direction * turnSpeed;

    const cos = Math.cos(angleToRotate);
    const sin = Math.sin(angleToRotate);

    const newX = ax * cos - ay * sin;
    const newY = ax * sin + ay * cos;

    this.moveX = newX;
    this.moveY = newY;
    this.speed = this.maxSpeed * angleToFactor(angle * (180 / Math.PI));
  }

  die() {
    this.render = false;
    this.active = false;

    const index = enemies.findIndex((item) => item.id === this.id);
    if (index !== -1) {
      enemies.splice(index, 1);
    } else {
      console.error("Could not find the index of enemy: " + this.id);
    }
  }

  update(currentDeltaTime) {
    if (!this.active) return;
    this.chaseTarget();
    this.move(currentDeltaTime);
    this.checkAllyProximity();
    this.handleBorderCollision();
    this.draw();
  }
}

function angleToFactor(angle) {
  if (angle <= 20) return 1;
  if (angle >= 120) return 0;

  // Linear interpolation from 1 (at 20) to 0 (at 120)
  return 1 - (angle - 20) / (120 - 20);
}
