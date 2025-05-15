import { windowWidth, windowHeight, gameHeight, gameWidth } from "./script.js";
import { playerCoords } from "./player.js";
const drawingOffset = { x: 0, y: 0 };

const xCoordHUD = document.getElementById("x");
const yCoordHUD = document.getElementById("y");

let baseHealthWidth = 200;
let healthHeight = 20;
let healthOffset = 50;

let borderOffset = 3000;

let shieldAnimationMax = 0.65;
let shieldAnimationMin = 0.35;
let shieldAnimation = shieldAnimationMin;
let shieldAnimationSpeed = 0.0075;
let shieldAnimationBaseSpeed = 0.0075;
let shieldAnimationSpeedDeviation = 0.005;
let shieldAnimationSpeedMin = 0.0025;
let shieldAnimationDirection = 1;

export function DrawPlayer(x, y, size, fillColor, strokeColor, context) {
  drawingOffset.x = windowWidth / 2 - playerCoords.x;
  drawingOffset.y = windowHeight / 2 - playerCoords.y;
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

export function DrawEnemy(
  x,
  y,
  size,
  shape,
  fillColor,
  strokeColor,
  context,
  hp,
  maxHp,
  context2
) {
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
  context.fillRect(
    borderX - borderOffset,
    borderY - borderOffset,
    gameWidth + borderOffset * 2,
    gameHeight + borderOffset * 2
  );
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

export function DrawAura(context, x, y, size, fillColor, strokeColor) {
  let renderX = x + drawingOffset.x;
  let renderY = y + drawingOffset.y;

  // Context setup
  context.fillStyle = fillColor;
  context.strokeStyle = strokeColor;
  context.lineWidth = Math.min(5, Math.max(1, size / 60));
  console.log(
    `x: ${x}, y: ${y}, size: ${size}, fillColor: ${fillColor}, strokeColor: ${strokeColor}, lineWidth: ${Math.min(
      5,
      Math.max(1, size / 60)
    )}`
  );

  // Drawing
  context.beginPath();
  context.arc(renderX, renderY, size, 0, Math.PI * 2);
  //context.fill();
  context.stroke();
}

export function updateHUD(
  x,
  y,
  health,
  maxHealth,
  context,
  shields,
  maxShields
) {
  xCoordHUD.textContent = "x: " + Math.round(x);
  yCoordHUD.textContent = "y: " + Math.round(y);

  context.fillStyle = "black";
  context.fillRect(
    healthOffset,
    windowHeight - healthOffset - healthHeight,
    baseHealthWidth,
    healthHeight
  );
  context.fillStyle = "red";
  context.fillRect(
    healthOffset + 3,
    windowHeight - healthOffset - healthHeight + 3,
    (baseHealthWidth - 6) * (health / maxHealth),
    healthHeight - 6
  );
  if (maxShields != 0) {
    shieldAnimationFunction();
    context.fillStyle = "hsla(59, 100.00%, 50.00%, " + shieldAnimation + ")";
    context.fillRect(
      healthOffset + 3,
      windowHeight - healthOffset - healthHeight + 3,
      (baseHealthWidth - 6) * (shields / maxShields),
      healthHeight - 6
    );
  }
}

function shieldAnimationFunction() {
  if (shieldAnimationDirection == 1) {
    shieldAnimation += shieldAnimationSpeed;
    if (shieldAnimation > shieldAnimationMax) {
      shieldAnimationDirection = 2;
      shieldAnimationSpeed = Math.max(
        shieldAnimationSpeedMin,
        Math.random() * shieldAnimationSpeedDeviation -
          shieldAnimationSpeedDeviation / 2 +
          shieldAnimationBaseSpeed
      );
    }
  } else {
    shieldAnimation -= shieldAnimationSpeed;
    if (shieldAnimation < shieldAnimationMin) {
      shieldAnimationDirection = 1;
      shieldAnimationSpeed = Math.max(
        shieldAnimationSpeedMin,
        Math.random() * shieldAnimationSpeedDeviation -
          shieldAnimationSpeedDeviation / 2 +
          shieldAnimationBaseSpeed
      );
    }
  }
}
