import { enemies, player } from "./script.js";

//? --- Aura ---
let auraHit = false;

export function AuraAttack(x, y, size, damage, aura, target) {
  if (target == "enemies") {
    for (let i = enemies.length - 1; i >= 0; i--) {
      attack(enemies[i], aura, x, y, size, damage);
    }
  }
  if (target == "player") {
    attack(player, aura, x, y, size, damage);
  }
  if (target == "playerAllies") {
    //TODO Player allies hit
  }

  if (auraHit == true) {
    aura.canHit = false;
    aura.timeout = setTimeout(() => {
      aura.canHit = true;
    }, aura.hitDelay);
    auraHit = false;
  }
}

function attack(target, aura, x, y, size, damage) {
  let dx = target.x - x;
  let dy = target.y - y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= size) {
    if (aura.canHit == false) return;

    target.gotHit(damage);
    auraHit = true;
  }
}
