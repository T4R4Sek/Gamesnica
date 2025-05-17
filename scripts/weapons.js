export class Aura {
  constructor(context, baseSize, baseDamage, fillColor, minAlpha, maxAlpha, strokeColor, hitDelay) {
    this.context = context;
    this.baseSize = baseSize;
    this.size = this.baseSize;
    this.baseDamage = baseDamage;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.hitDelay = hitDelay;
    this.rotation = Math.floor(Math.random() * 360);
    this.rotationSpeed = 0.003 + Math.random() * 0.002;
    Math.random() > 0.5 ? (this.rotationDirection = 1) : (this.rotationDirection = -1);
    this.canHit = true;
    this.timeout = null;
    this.minAlpha = minAlpha;
    this.maxAlpha = maxAlpha;
    this.currentAlpha = this.minAlpha;
    this.lineWidth = 1;
  }

  hitAnimation() {
    this.currentAlpha = this.maxAlpha;
    this.updateSizeAndLineWidth();
  }

  updateRender() {
    this.currentAlpha -= 0.006;

    this.updateSizeAndLineWidth();
    if (this.currentAlpha < this.minAlpha) {
      this.currentAlpha = this.minAlpha;
    }
  }

  updateSizeAndLineWidth() {
    let scalar = (this.currentAlpha - this.minAlpha) / (this.maxAlpha - this.minAlpha);
    this.size = this.baseSize + this.baseSize * 0.04 * Math.max(0, scalar);
    this.lineWidth = 1 + 1.2 * Math.max(0, scalar);
  }
}
