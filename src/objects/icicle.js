import Rectangle from "./rectangle.js";

const g = 0.5;  //TODO

export default class Icicle extends Rectangle {

  static get growth() { return 0.01; }
  static get maxHeight() { return 40; }

  constructor(id, x, y, width = 5, height = 7, isFalling = false, velocity = 0) {
    super(x, y, width, height);
    this.id = id;
    this.isFalling = isFalling;
    this.velocity = velocity;
    this.damage = 1;
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
    grd.addColorStop(0, `rgba(180, 207, 250, 1)`);
    grd.addColorStop(0.5, `rgba(180, 207, 250, 1)`);
    grd.addColorStop(0.5, `rgba(255, 255, 255, 1)`);
    grd.addColorStop(1, `rgba(255, 255, 255, 1)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + (this.width / 2), this.y + this.height);
    ctx.fill();
  }

  serialize() {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.width = this.width;
    res.height = this.height;
    res.velocity = this.velocity;
    res.shattered = this. shattered;
    return res;
  };

  updateState(state){
    return;
  };
}
