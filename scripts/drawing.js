import { windowWidth, windowHeight, gameHeight, gameWidth, healthChangeDisplays, player } from "./script.js";
const drawingOffset = { x: 0, y: 0 };

const xCoordHUD = document.getElementById("x");
const yCoordHUD = document.getElementById("y");
const fpsHUD = document.getElementById("fps");

let lastTime = 0;
let fps = 0;

export const baseHealthWidth = 200;
export const healthHeight = 20;
export const healthOffset = 50;

let borderOffset = 3000;

const shieldAnimationMax = 0.65;
const shieldAnimationMin = 0.35;
let shieldAnimation = shieldAnimationMin;
let shieldAnimationSpeed = 0.0075;
let shieldAnimationBaseSpeed = 0.0075;
let shieldAnimationSpeedDeviation = 0.005;
let shieldAnimationSpeedMin = 0.0025;
let shieldAnimationDirection = 1;

export function DrawPlayer(x, y, size, fillColor, strokeColor, context) {
  context.fillStyle = fillColor;
  context.strokeStyle = strokeColor;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(windowWidth / 2, windowHeight / 2, size, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  // Shadow
  // context.beginPath();
  // context.arc(x, y, size, 0, Math.PI * 2);
  // context.stroke();
}

export function DrawEnemy(x, y, size, shape, fillColor, strokeColor, context, hp, maxHp, context2) {
  context.fillStyle = fillColor;
  context.strokeStyle = strokeColor;
  context.lineWidth = 1;
  let renderX = x + drawingOffset.x;
  let renderY = y + drawingOffset.y;
  if (shape == "circle") {
    context.beginPath();
    context.arc(renderX, renderY, size, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  } else {
    context.fillRect(renderX - size, renderY - size, size * 2, size * 2);
    context.strokeRect(renderX - size, renderY - size, size * 2, size * 2);
  }

  context2.globalAlpha = 1;
  context2.lineWidth = 4;
  context2.strokeStyle = "black";
  context2.beginPath();
  context2.moveTo(renderX - size, renderY - size - 5);
  context2.lineTo(renderX + size, renderY - size - 5);
  context2.stroke();
  context2.lineWidth = 3;
  context2.strokeStyle = "red";
  context2.beginPath();
  context2.moveTo(renderX - size, renderY - size - 5);
  context2.lineTo(renderX - size + size * 2 * (hp / maxHp), renderY - size - 5);
  context2.stroke();
}

export function DrawBorder(context) {
  let borderX = drawingOffset.x;
  let borderY = drawingOffset.y;
  context.strokeStyle = "black";
  context.fillStyle = "rgb(117, 117, 117)";
  context.lineWidth = 5;
  // Gray Filling
  context.fillRect(borderX - borderOffset, borderY - borderOffset, gameWidth + borderOffset * 2, gameHeight + borderOffset * 2);
  // Clear space inside
  context.clearRect(borderX, borderY, gameWidth, gameHeight);
  // Draw black border
  context.beginPath();
  context.moveTo(borderX - 3, borderY - 3);
  context.lineTo(borderX - 3, borderY + gameHeight + 3);
  context.lineTo(borderX + gameWidth + 3, borderY + gameHeight + 3);
  context.lineTo(borderX + gameWidth + 3, borderY - 3);
  context.closePath();
  context.stroke();
}

export function DrawAura(x, y, size, aura) {
  let renderX = x + drawingOffset.x;
  let renderY = y + drawingOffset.y;

  // Context setup
  if (aura.baseDamage !== undefined && aura.baseDamage != null) {
    let dashes = Math.round(Math.min(10, Math.max(2, aura.baseSize / 30)));
    aura.context.setLineDash([(Math.PI * size) / dashes, (Math.PI * size) / dashes]);
  } else {
    aura.context.setLineDash([]);
  }
  aura.context.fillStyle = aura.fillColor;
  aura.context.strokeStyle = aura.strokeColor;
  aura.context.lineWidth = Math.min(4, Math.max(1, size / 60)) * aura.lineWidth;

  aura.rotation += 0.003 * aura.rotationDirection;
  if (aura.rotation >= 360 || aura.rotation <= -360) aura.rotation = 0;

  // Drawing
  aura.context.save();

  aura.context.translate(renderX, renderY);
  aura.context.rotate(aura.rotation);

  aura.context.beginPath();
  aura.context.arc(0, 0, size, 0, Math.PI * 2);

  aura.context.globalAlpha = aura.currentAlpha;
  aura.context.fill();

  aura.context.globalAlpha = 1;
  aura.context.stroke();

  aura.context.restore();

  if (aura.baseHeal !== undefined && aura.baseHeal != null) {
  }

  if (aura.currentAlpha > aura.minAlpha) {
    aura.updateRender();
  }
}

export function DrawTextDisplay(x, y, text, context, opacity, strokeStyle) {
  let renderX = x + drawingOffset.x;
  let renderY = y + drawingOffset.y;

  context.globalAlpha = opacity;
  context.fillStyle = "white";
  context.strokeStyle = strokeStyle;
  context.lineWidth = 1;
  context.font = "18px Arial";
  context.textAlign = "center";
  context.textBaseLine = "middle";
  context.strokeText(text, renderX, renderY);
  context.fillText(text, renderX, renderY);
}

export function DrawHealingOrb(orb) {
  orb.context.lineWidth = 1;
  orb.context.fillStyle = "hsl(120, 100%, " + 50 * orb.whitenessMultiplier + "%)";
  orb.context.strokeStyle = "hsl(120, 100%, " + 50 * orb.whitenessMultiplier + "%)";
  orb.context.beginPath();
  orb.context.globalAlpha = 1;
  orb.context.arc(orb.x + drawingOffset.x, orb.y + drawingOffset.y, 3, 0, Math.PI * 2);
  orb.context.fill();
  orb.context.beginPath();
  orb.context.globalAlpha = 0.2;
  orb.context.arc(orb.x + drawingOffset.x, orb.y + drawingOffset.y, 8, 0, Math.PI * 2);
  orb.context.fill();
  orb.context.stroke();
}

export function DrawCoin(coin) {
  coin.context.lineWidth = 1;
  coin.context.fillStyle = "rgb(255, 255, 0)";
  coin.context.strokeStyle = "rgb(255, 255, 255)";
  coin.context.beginPath();
  coin.context.globalAlpha = 1;
  coin.context.arc(coin.x + drawingOffset.x, coin.y + drawingOffset.y, 2, 0, Math.PI * 2);
  coin.context.stroke();
  coin.context.fill();
}

export function UpdateHUD(x, y, health, maxHealth, context, shields, maxShields) {
  xCoordHUD.textContent = "x: " + Math.round(x);
  yCoordHUD.textContent = "y: " + Math.round(y);

  const now = performance.now();
  const delta = now - lastTime;
  lastTime = now;

  fps = Math.round(1000 / delta);

  fpsHUD.textContent = "fps: " + fps;

  // HUD health outline
  context.fillStyle = "black";
  context.fillRect(healthOffset, windowHeight - healthOffset - healthHeight, baseHealthWidth, healthHeight);

  // HUD heatlh fill
  HealthBar();

  // HUD shields
  ShieldBar();

  // Coins
  context.font = "20px Arial";
  context.fillStyle = "yellow";
  context.strokeStyle = "black";
  context.fillText(player.coins, 90, 150);

  context.lineWidth = 1;
  context.textAlign = "left";
  context.textBaseLine = "middle";
  context.beginPath();
  context.arc(82, 144, 4, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  function HealthBar() {
    context.fillStyle = "red";
    context.fillRect(
      healthOffset + 3,
      windowHeight - healthOffset - healthHeight + 3,
      (baseHealthWidth - 6) * (Math.max(0, health) / maxHealth),
      healthHeight - 6
    );
  }

  function ShieldBar() {
    context.fillStyle = "black";
    context.fillRect(healthOffset, windowHeight - healthOffset - healthHeight - 25, baseHealthWidth, healthHeight);

    shieldAnimationFunction();
    context.fillStyle = "rgb(0, 174, 255)";
    context.fillRect(
      healthOffset + 3,
      windowHeight - healthOffset - healthHeight + 3 - 25,
      (baseHealthWidth - 6) * (Math.max(0, shields) / maxShields),
      healthHeight - 6
    );

    context.fillStyle = "hsla(0, 100.00%, 100.00%, " + shieldAnimation + ")";
    context.fillRect(
      healthOffset + 3,
      windowHeight - healthOffset - healthHeight + 3 - 25,
      (baseHealthWidth - 6) * (Math.max(0, shields) / maxShields),
      healthHeight - 6
    );
  }
}

/**
 * Updates the drawingOffset variable, used to render stuff
 *
 * @param {number} x - The width of the rectangle.
 * @param {number} y - The height of the rectangle.
 */
export function UpdateOffset(x, y) {
  drawingOffset.x = windowWidth / 2 - x;
  drawingOffset.y = windowHeight / 2 - y;
}

/**
 * Animates the shield HUD
 */
function shieldAnimationFunction() {
  if (shieldAnimationDirection == 1) {
    shieldAnimation += shieldAnimationSpeed;
    if (shieldAnimation > shieldAnimationMax) {
      shieldAnimationDirection = 2;
      shieldAnimationSpeed = Math.max(
        shieldAnimationSpeedMin,
        Math.random() * shieldAnimationSpeedDeviation - shieldAnimationSpeedDeviation / 2 + shieldAnimationBaseSpeed
      );
    }
  } else {
    shieldAnimation -= shieldAnimationSpeed;
    if (shieldAnimation < shieldAnimationMin) {
      shieldAnimationDirection = 1;
      shieldAnimationSpeed = Math.max(
        shieldAnimationSpeedMin,
        Math.random() * shieldAnimationSpeedDeviation - shieldAnimationSpeedDeviation / 2 + shieldAnimationBaseSpeed
      );
    }
  }
}
