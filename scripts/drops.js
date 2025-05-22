import { Coin, HealingOrb } from "./collectibles.js";
import { collectibles, player, ctx2, nextId } from "./script.js";

let collectiblesNextId = 0;

export function checkDrops(x, y, type) {
  if (Math.random() < 0) {
    collectibles.push(new HealingOrb(x, y, ctx2, collectiblesNextId++));
  }
  for (let i = 0; i < 1; i++) {
    if (Math.random() < 1) {
      collectibles.push(new Coin(x, y, ctx2, collectiblesNextId++, 1));
    }
  }
}
