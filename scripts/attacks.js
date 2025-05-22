import { DrawAura } from "./drawing.js";
import { enemies, player } from "./script.js";
import { DamageAura, HealAura } from "./weapons.js";

//? --- Aura ---
let auraHit = false;

export function AuraHeal(x, y, size, healAmount, aura, faction) {
  if (faction == "player") {
    heal(player, aura, x, y, size, healAmount);
  }
  if (faction == "enemies") {
    for (let i = enemies.length - 1; i >= 0; i--) {
      heal(enemies[i], aura, x, y, size, healAmount);
    }
  }
  if (faction == "bountyHunters") {
    //TODO Player allies hit
  }

  if (auraHit == true) {
    aura.canHit = false;
    aura.healAnimation();
    aura.timeout = setTimeout(() => {
      aura.canHit = true;
    }, aura.hitDelay);
    auraHit = false;
  }
}

function getDistance(target, targetter) {
  let dx = target.x - targetter.x;
  let dy = target.y - targetter.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export class AuraAreaEffect {
  constructor(x, y, faction) {
    this.x = x;
    this.y = y;
    this.faction = faction;
  }

  draw() {}

  update() {
    this.aura.handleAura(this.x, this.y, this.aura, this.faction);

    DrawAura(this.x, this.y, this.aura.size, this.aura);
  }
}

export class DamageAuraAreaEffect extends AuraAreaEffect {
  constructor(x, y, faction, context, baseSize, baseDamage, hitDelay) {
    super(x, y, faction);
    this.aura = new DamageAura(context, baseSize, baseDamage, hitDelay, faction);

    let stats = this.updateStats();
    this.size = stats.size;
    this.damage = stats.damage;
  }

  updateStats() {
    if (this.faction == "player") {
      let size = this.aura.baseSize;
      let damage = this.aura.baseDamage;

      return { size: size, damage: damage };
    } else {
      let size = this.aura.baseSize;
      let damage = this.aura.baseDamage;

      return { size: size, damage: damage };
    }
  }
}

export class HealAuraAreaEffect extends AuraAreaEffect {
  constructor(x, y, faction, context, baseSize, baseHeal, healDelay) {
    super(x, y, faction);
    this.aura = new HealAura(context, baseSize, baseHeal, healDelay, faction);

    let stats = this.updateStats();
    this.size = stats.size;
    this.heal = stats.heal;
  }

  updateStats() {
    if (this.faction == "player") {
      let size = this.aura.baseSize;
      let heal = this.aura.baseHeal;

      return { size: size, heal: heal };
    } else {
      let size = this.aura.baseSize;
      let heal = this.aura.baseHeal;

      return { size: size, heal: heal };
    }
  }
}
