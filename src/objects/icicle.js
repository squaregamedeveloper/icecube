import Rectangle from "./rectangle.js";

const g = 0.5;  //TODO

export default class Icicle extends Rectangle {
  static get growth() { return 0.01; }
  static get maxHeight() { return 40; }
  constructor(platform) {
    let y = platform.y + platform.height;
    let x = Math.floor((Math.random() * (platform.width - 40))) + platform.x + 10;
    super(x, y, 5, 7);
    this.color = "#b4cffa" + (Math.floor(Math.random() * 100) + 155).toString(16);
    this.alpha =  0.5 + Math.random();
    this.isFalling = false;
    this.velocity = 0;
  }

  update(world) {
    if (!this.isFalling) {
      this.height += Icicle.growth * world.delta * 2;
      this.width += Icicle.growth * world.delta;
      this.x -= Icicle.growth * world.delta * 0.5;
      if (this.height >= Icicle.maxHeight) this.isFalling = true;
    } else { // IsFalling
      this.velocity += g * world.delta * world.delta;
      this.y += this.velocity;
    }
  }

  draw(ctx){
    let grd = ctx.createLinearGradient(this.x, this.y, this.x + 10, this.y + 35);
    grd.addColorStop(0, `rgba(180, 207, 250, ${this.alpha})`);
    grd.addColorStop(0.5, `rgba(180, 207, 250, ${this.alpha})`);
    grd.addColorStop(0.5, `rgba(255, 255, 255, ${this.alpha})`);
    grd.addColorStop(1, `rgba(255, 255, 255, ${this.alpha})`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + (this.width / 2), this.y + this.height);
    ctx.fill();
  }
}
