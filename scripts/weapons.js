export class Aura {
  constructor(context, baseSize, baseDamage, fillColor, strokeColor, hitDelay) {
    this.context = context;
    this.baseSize = baseSize;
    this.baseDamage = baseDamage;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.hitDelay = hitDelay;
    this.rotation = Math.floor(Math.random() * 360);
    this.canHit = true;
    this.timeout = null;
  }
}
