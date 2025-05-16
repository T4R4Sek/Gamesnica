import { HealingOrb } from "./collectibles.js";
import { collectibles, player, ctx4 } from "./script.js";

export function checkDrops(x, y, type) {
  if (Math.random() < 0.1) {
    collectibles.push(new HealingOrb(x, y, ctx4));
  }
}
