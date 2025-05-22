import { enemies, player } from "./script.js";

let auraDamageColors = {
  player: ["rgb(70, 243, 255)", "rgb(70, 203, 255)", 0.15, 0.4],
  enemies: ["red", "red", 0.1, 0.35],
  bountyHunters: ["yellow", "yellow", 0.1, 0.35],
};
let auraHealColors = {
  player: ["rgb(86, 255, 70)", "rgb(86, 255, 70)", 0.15, 0.4],
  enemies: ["rgb(86, 255, 70)", "red", 0.1, 0.35],
  bountyHunters: ["rgb(86, 255, 70)", "yellow", 0.1, 0.35],
};
let auraHit = false;

export class Aura {
  constructor(context, baseSize, hitDelay, faction) {
    this.context = context;
    this.faction = faction;
    this.baseSize = baseSize;
    this.size = this.baseSize;
    this.hitDelay = hitDelay;

    this.rotation = Math.floor(Math.random() * 360);
    this.rotationSpeed = 0.003 + Math.random() * 0.002;
    Math.random() > 0.5 ? (this.rotationDirection = 1) : (this.rotationDirection = -1);
    this.timeout = null;
    this.lineWidth = 1;
    this.lastHit = 0;
    this.gameStopAddon = 0;
  }

  actionAnimation() {
    this.currentAlpha = this.maxAlpha;
  }

  updateRender() {
    this.currentAlpha -= 0.006;

    this.updateSizeAndLineWidth();
    if (this.currentAlpha < this.minAlpha) {
      this.currentAlpha = this.minAlpha;
    }
  }
}

export class DamageAura extends Aura {
  constructor(context, baseSize, baseDamage, hitDelay, faction) {
    super(context, baseSize, hitDelay, faction);
    this.baseDamage = baseDamage;

    let colors = colorPick(this.faction, auraDamageColors);
    this.fillColor = colors[0];
    this.strokeColor = colors[1];
    this.minAlpha = colors[2];
    this.maxAlpha = colors[3];
    this.currentAlpha = this.minAlpha;

    this.hitDelay = hitDelay;
    this.currentAlpha = this.minAlpha;
  }

  actionAnimation() {
    super.actionAnimation();

    this.updateSizeAndLineWidth();
  }

  updateSizeAndLineWidth() {
    let scalar = (this.currentAlpha - this.minAlpha) / (this.maxAlpha - this.minAlpha);
    this.size = this.baseSize + this.baseSize * 0.04 * Math.max(0, scalar);
    this.lineWidth = 1 + 1.2 * Math.max(0, scalar);
  }

  action(target, aura, x, y, size, damage) {
    if (getDistance(target, { x, y }) <= size && aura.canHit == true) {
      target.gotHit(damage);
      auraHit = true;
    }
  }

  handleAura(x, y, aura, faction) {
    if (faction == "enemies") {
      this.action(player, aura, x, y, aura.size, aura.baseDamage);
      //TODO + hit bounty hunters
    }
    if (faction == "player") {
      for (let i = enemies.length - 1; i >= 0; i--) {
        this.action(enemies[i], aura, x, y, aura.size, aura.baseDamage);
      }
      //TODO + hit bounty hunters
    }
    if (faction == "bountyHunters") {
      this.action(player, aura, x, y, aura.size, aura.baseDamage);

      for (let i = enemies.length - 1; i >= 0; i--) {
        this.action(enemies[i], aura, x, y, aura.size, aura.baseDamage);
      }
    }

    if (auraHit == true) {
      aura.lastHit = Date.now();
      aura.actionAnimation();
      auraHit = false;
      aura.canHit = false;
    } else if (Date.now() > aura.lastHit + aura.hitDelay + aura.gameStopAddon) {
      aura.canHit = true;
      aura.gameStopAddon = 0;
    }
  }
}

export class HealAura extends Aura {
  constructor(context, baseSize, baseHeal, hitDelay, faction) {
    super(context, baseSize, hitDelay, faction);
    this.baseHeal = baseHeal;

    let colors = colorPick(this.faction, auraHealColors);
    this.fillColor = colors[0];
    this.strokeColor = colors[1];
    this.minAlpha = colors[2];
    this.maxAlpha = colors[3];
    this.currentAlpha = this.minAlpha;

    this.hitDelay = hitDelay;
    this.currentAlpha = this.minAlpha;
  }

  actionAnimation() {
    super.actionAnimation();

    this.updateSizeAndLineWidth();
  }

  updateSizeAndLineWidth() {
    let scalar = (this.currentAlpha - this.minAlpha) / (this.maxAlpha - this.minAlpha);
    this.size = this.baseSize + this.baseSize * 0.04 * Math.max(0, scalar);
    this.lineWidth = 1 + 1.2 * Math.max(0, scalar);
  }

  action(target, aura, x, y, size, healAmount) {
    if (getDistance(target, { x, y }) <= size && aura.canHit == true) {
      let targetHpDifference = target.maxHp - target.hp;
      if (targetHpDifference > healAmount) {
        target.heal(healAmount);
        auraHit = true;
      } else if (targetHpDifference > 0) {
        target.heal(target.maxHp - target.hp);
        auraHit = true;
      }
    }
  }

  handleAura(x, y, aura, faction) {
    if (faction == "player") {
      this.action(player, aura, x, y, aura.size, aura.baseHeal);
    }
    if (faction == "enemies") {
      for (let i = enemies.length - 1; i >= 0; i--) {
        this.action(enemies[i], aura, x, y, aura.size, aura.baseHeal);
      }
    }
    if (faction == "bountyHunters") {
      //TODO Player allies hit
    }

    if (auraHit == true) {
      aura.lastHit = Date.now();
      aura.actionAnimation();
      auraHit = false;
      aura.canHit = false;
    } else if (Date.now() > aura.lastHit + aura.hitDelay + aura.gameStopAddon) {
      aura.canHit = true;
      aura.gameStopAddon = 0;
    }
  }
}

function colorPick(faction, auraColors) {
  if (faction == "player") return [...auraColors.player];
  else if (faction == "enemies") return [...auraColors.enemies];
  else if (faction == "bountyHunters") return [...auraColors.bountyHunters];
  else console.error("Incorrect faction");
}

function getDistance(target, targetter) {
  let dx = target.x - targetter.x;
  let dy = target.y - targetter.y;
  return Math.sqrt(dx * dx + dy * dy);
}
