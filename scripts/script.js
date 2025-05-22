// UKOL Z MATIKY
// H E M

import { Player, playerCoords } from "./player.js";
import { Enemy } from "./enemy.js";
import { DrawBorder, UpdateHUD } from "./drawing.js";
import { DamageAuraAreaEffect, HealAuraAreaEffect } from "./attacks.js";

const startGameButton = document.getElementById("startGameButton");
const quitGameButton = document.getElementById("quitGameButton");
const startingScreen = document.getElementById("startingScreen");
const midGameScreen = document.getElementById("midGameScreen");

const gameBoard0 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard0");
const gameBoard1 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard1");
const gameBoard2 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard2");
const gameBoard3 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard3");
const gameBoard4 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard4");
const gameBoard5 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard5");
const gameBoard6 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard6");
const gameBoard7 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard7");
const gameBoard8 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard8");
const gameBoard9 = /** @type {HTMLCanvasElement} */ document.getElementById("gameBoard9");

const ctx0 = /** @type {CanvasRenderingContext2D} */ gameBoard0.getContext("2d");
const ctx1 = /** @type {CanvasRenderingContext2D} */ gameBoard1.getContext("2d");
export const ctx2 = /** @type {CanvasRenderingContext2D} */ gameBoard2.getContext("2d"); // Effects
const ctx3 = /** @type {CanvasRenderingContext2D} */ gameBoard3.getContext("2d"); // Enemies
export const ctx4 = /** @type {CanvasRenderingContext2D} */ gameBoard4.getContext("2d");
const ctx5 = /** @type {CanvasRenderingContext2D} */ gameBoard5.getContext("2d"); // Player
const ctx6 = /** @type {CanvasRenderingContext2D} */ gameBoard6.getContext("2d"); // Heatlh Change Display
const ctx7 = /** @type {CanvasRenderingContext2D} */ gameBoard7.getContext("2d");
const ctx8 = /** @type {CanvasRenderingContext2D} */ gameBoard8.getContext("2d"); // Border, HUD
const ctx9 = /** @type {CanvasRenderingContext2D} */ gameBoard9.getContext("2d");

let lastTime = performance.now();
let accumulator = 0;
const step = 1000 / 60;
export let gameRunning = false;
export let inGame = false;
let lastGameStop = 0;
let gameStopAddon = 0;
export let nextId = 0;
export let gameWidth = 1800;
export let gameHeight = gameWidth;
let blurOn = false;

export let windowWidth;
export let windowHeight;
export let player;
export const enemies = [];
export const collectibles = [];
export const healthChangeDisplays = [];
export const areaEffects = [];

function startGame() {
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

  lastGameStop = Date.now();

  player = new Player(ctx5, ctx2, ctx6);

  areaEffects.push(new DamageAuraAreaEffect(450 + Math.random() * 900, 450 + Math.random() * 900, "player", ctx2, 300, 50, 1000));
  areaEffects.push(new DamageAuraAreaEffect(450 + Math.random() * 900, 450 + Math.random() * 900, "player", ctx2, 300, 50, 1000));
  areaEffects.push(new DamageAuraAreaEffect(450 + Math.random() * 900, 450 + Math.random() * 900, "player", ctx2, 300, 50, 1000));

  setTimeout(() => {
    for (let i = 0; i < 35; i++) {
      enemies.push(
        new Enemy(ctx3, ctx4, ctx2, ctx6, nextId++, 50 + 50 * i, 200, 20, "rgb(255, 155, 155)", "red", 25, "circle", "chasePlayer")
      );
    }
    for (let i = 0; i < 35; i++) {
      enemies.push(
        new Enemy(ctx3, ctx4, ctx2, ctx6, nextId++, 50 + 50 * i, 250, 20, "rgb(255, 155, 155)", "red", 25, "circle", "chasePlayer")
      );
    }
  }, 50);

  requestAnimationFrame(update);
}

function reset() {
  clearBoards();

  player = null;
  enemies.length = 0;
  collectibles.length = 0;
  healthChangeDisplays.length = 0;
  areaEffects.length = 0;
  lastTime = 0;
}

function update(timestamp) {
  let delta = timestamp - lastTime;
  lastTime = timestamp;
  accumulator += delta;

  while (accumulator >= step) {
    gameUpdate(step / 1000); // pass delta time in seconds
    accumulator -= step;
  }

  if (gameRunning && inGame) {
    requestAnimationFrame(update);
  }

  function gameUpdate(deltaTime) {
    clearBoards();

    //? --- Actual updates ---
    player.update(deltaTime);

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(deltaTime);
    }

    // Update collectibles
    for (let i = collectibles.length - 1; i >= 0; i--) {
      collectibles[i].update(deltaTime);
    }
    // Update damage displays
    for (let i = healthChangeDisplays.length - 1; i >= 0; i--) {
      healthChangeDisplays[i].update(deltaTime);
    }

    for (let i = areaEffects.length - 1; i >= 0; i--) {
      areaEffects[i].update(deltaTime);
    }

    DrawBorder(ctx8);

    UpdateHUD(playerCoords.x, playerCoords.y, player.hp, player.maxHp, ctx8, player.sp, player.maxSp);
  }
}

function quitGame() {
  midGameScreen.style.display = "none";
  startingScreen.style.display = "inline";

  inGame = false;
  gameRunning = false;

  reset();
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
    enemies.push(new Enemy(ctx3, nextId++, 50 + 8 * i, 50, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer"));
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(ctx3, nextId++, gameWidth - 50 - 8 * i, 50, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer")
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
      new Enemy(ctx3, nextId++, 50 + 8 * i, gameHeight - 50, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer")
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(ctx3, nextId++, 50, gameHeight - 50 - 8 * i, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer")
    );
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(new Enemy(ctx3, nextId++, 50, 50 + 8 * i, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer"));
  }
  for (let i = 0; i < 200; i++) {
    enemies.push(
      new Enemy(ctx3, nextId++, gameWidth - 50, 50 + 8 * i, 20, "rgb(255, 155, 155)", "red", 20 + i * 0.25, "circle", "chasePlayer")
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

document.addEventListener("keydown", (event) => {
  if (inGame == false) return;

  if (event.key == "Escape") {
    stopGame();
  }
});

function stopGame() {
  gameRunning = !gameRunning;

  //
  // gameStopAddon:
  //
  // Accumulates all the time that has passed in stopped mode and then adds it where it is
  // needed because of actions that take time and are checked by Date.now()
  //dddddd
  // I feel like it is better then to allways add the deltaTime and check it like that
  //

  if (gameRunning == true && inGame == true) {
    midGameScreen.style.display = "none";

    gameStopAddon = Date.now() - lastGameStop;

    // Update enemy auras
    enemies.forEach((enemy) => {
      if (enemy.aura != null) {
        enemy.aura.gameStopAddon += gameStopAddon;
      }
    });

    // Update player aura
    if (player.aura != null && player.aura !== undefined) {
      player.aura.gameStopAddon += gameStopAddon;
    }
    player.gameStopAddonShields += gameStopAddon;

    // Update player auras
    areaEffects.forEach((auraEffect) => {
      if (auraEffect.aura != null) {
        auraEffect.aura.gameStopAddon += gameStopAddon;
      }
    });

    update();
  } else {
    midGameScreen.style.display = "inline";
    lastGameStop = Date.now();
  }
}

window.addEventListener("blur", () => {
  if (blurOn == true) exitedWindow();
});

document.addEventListener("visibilitychange", () => {
  exitedWindow();
});

function exitedWindow() {
  if (inGame == false) return;

  if (gameRunning == true) {
    stopGame();
  }
}

startGameButton.addEventListener("click", () => {
  startingScreen.style.display = "none";
  inGame = true;
  gameRunning = true;

  startGame();
});

quitGameButton.addEventListener("click", () => {
  quitGame();
});
