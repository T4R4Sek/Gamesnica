import { Player, playerCoords } from "./player.js";
import { Enemy } from "./enemy.js";
import { DrawBorder, updateHUD } from "./drawing.js";

const gameBoard0 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard0");
const gameBoard1 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard1");
const gameBoard2 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard2");
const gameBoard3 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard3");
const gameBoard4 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard4");
const gameBoard5 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard5");
const gameBoard6 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard6");
const gameBoard7 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard7");
const gameBoard8 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard8");
const gameBoard9 =
  /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard9");

const ctx0 =
  /** @type {CanvasRenderingContext2D} */ gameBoard0.getContext("2d");
const ctx1 =
  /** @type {CanvasRenderingContext2D} */ gameBoard1.getContext("2d");
const ctx2 =
  /** @type {CanvasRenderingContext2D} */ gameBoard2.getContext("2d");
const ctx3 =
  /** @type {CanvasRenderingContext2D} */ gameBoard3.getContext("2d");
const ctx4 =
  /** @type {CanvasRenderingContext2D} */ gameBoard4.getContext("2d");
const ctx5 =
  /** @type {CanvasRenderingContext2D} */ gameBoard5.getContext("2d");
const ctx6 =
  /** @type {CanvasRenderingContext2D} */ gameBoard6.getContext("2d");
const ctx7 =
  /** @type {CanvasRenderingContext2D} */ gameBoard7.getContext("2d");
const ctx8 =
  /** @type {CanvasRenderingContext2D} */ gameBoard8.getContext("2d");
const ctx9 =
  /** @type {CanvasRenderingContext2D} */ gameBoard9.getContext("2d");

let lastTime = 0;
const targetFPS = 140;
const frameDuration = 1000 / targetFPS;
let deltaTimeAccumulated = 0;
let gameRunning = true;
let nextId = 0;
export let gameWidth = 1800;
export let gameHeight = gameWidth;

export let windowWidth;
export let windowHeight;
const player = new Player(ctx5, ctx2);
export const enemies = [];

function load() {
  clearBoards();

  windowWidth = window.innerWidth * devicePixelRatio;
  windowHeight = window.innerHeight * devicePixelRatio;
  gameBoard0.width = windowWidth;
  gameBoard0.height = windowHeight;
  gameBoard1.width = windowWidth;
  gameBoard1.height = windowHeight;
  gameBoard2.width = windowWidth;
  gameBoard2.height = windowHeight;
  gameBoard3.width = windowWidth;
  gameBoard3.height = windowHeight;
  gameBoard4.width = windowWidth;
  gameBoard4.height = windowHeight;
  gameBoard5.width = windowWidth;
  gameBoard5.height = windowHeight;
  gameBoard6.width = windowWidth;
  gameBoard6.height = windowHeight;
  gameBoard7.width = windowWidth;
  gameBoard7.height = windowHeight;
  gameBoard8.width = windowWidth;
  gameBoard8.height = windowHeight;
  gameBoard9.width = windowWidth;
  gameBoard9.height = windowHeight;

  gameBoard0.style.width = window.innerWidth + "px";
  gameBoard0.style.height = window.innerHeight + "px";
  gameBoard1.style.width = window.innerWidth + "px";
  gameBoard1.style.height = window.innerHeight + "px";
  gameBoard2.style.width = window.innerWidth + "px";
  gameBoard2.style.height = window.innerHeight + "px";
  gameBoard3.style.width = window.innerWidth + "px";
  gameBoard3.style.height = window.innerHeight + "px";
  gameBoard4.style.width = window.innerWidth + "px";
  gameBoard4.style.height = window.innerHeight + "px";
  gameBoard5.style.width = window.innerWidth + "px";
  gameBoard5.style.height = window.innerHeight + "px";
  gameBoard6.style.width = window.innerWidth + "px";
  gameBoard6.style.height = window.innerHeight + "px";
  gameBoard7.style.width = window.innerWidth + "px";
  gameBoard7.style.height = window.innerHeight + "px";
  gameBoard8.style.width = window.innerWidth + "px";
  gameBoard8.style.height = window.innerHeight + "px";
  gameBoard9.style.width = window.innerWidth + "px";
  gameBoard9.style.height = window.innerHeight + "px";
}

function reset() {
  clearBoards();

  player.reset();
  enemies = [];
  lastTime = 0;
}

function update(timestamp) {
  gameRunning ? requestAnimationFrame(update) : null; // Only update if the game is running
  let deltaTime = timestamp - lastTime;
  deltaTimeAccumulated += deltaTime;
  if (deltaTime < frameDuration) {
    return; // Skip this frame to maintain the target FPS
  }
  lastTime = timestamp;

  clearBoards();

  if (isNaN(deltaTimeAccumulated)) deltaTimeAccumulated = 0;
  deltaTimeAccumulated *= 0.001;

  //? --- Actual updates ---
  player.update(deltaTimeAccumulated);
  // DrawEnemy(100, 150, 20, "circle", "rgb(255, 118, 118)", "red", ctx3);
  enemies.forEach((enemy) => enemy.update(deltaTimeAccumulated));
  DrawBorder(ctx8);
  updateHUD(
    playerCoords.x,
    playerCoords.y,
    player.hp,
    player.maxHp,
    ctx9,
    player.sp,
    player.maxSp
  );
  //? --- End of updates ---

  deltaTimeAccumulated = 0;
}

function clearBoards() {
  ctx0.clearRect(0, 0, windowWidth, windowHeight);
  ctx1.clearRect(0, 0, windowWidth, windowHeight);
  ctx2.clearRect(0, 0, windowWidth, windowHeight);
  ctx3.clearRect(0, 0, windowWidth, windowHeight);
  ctx4.clearRect(0, 0, windowWidth, windowHeight);
  ctx5.clearRect(0, 0, windowWidth, windowHeight);
  ctx6.clearRect(0, 0, windowWidth, windowHeight);
  ctx7.clearRect(0, 0, windowWidth, windowHeight);
  ctx8.clearRect(0, 0, windowWidth, windowHeight);
  ctx9.clearRect(0, 0, windowWidth, windowHeight);
}

function randomStuff() {
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        50 + 8 * i,
        50,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        gameWidth - 50 - 8 * i,
        50,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        gameWidth - 50 - 8 * i,
        gameHeight - 50,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        50 + 8 * i,
        gameHeight - 50,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        50,
        gameHeight - 50 - 8 * i,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        50,
        50 + 8 * i,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        gameWidth - 50,
        50 + 8 * i,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        nextId++,
        gameWidth - 50,
        gameHeight - 50 - 8 * i,
        20,
        "rgb(255, 155, 155)",
        "red",
        20 + i * 0.25,
        "circle",
        "chasePlayer"
      )
    );
  }
}

setTimeout(() => {
  for (let i = 0; i < 30; i++) {
    enemies.push(
      new Enemy(
        ctx3,
        ctx4,
        nextId++,
        50 + 50 * i,
        400,
        20,
        "rgb(255, 155, 155)",
        "red",
        25,
        "circle",
        "chasePlayer"
      )
    );
  }
}, 50);

load();
update();
