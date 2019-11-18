import Rectangle from "./rectangle.js";
export default class Bullet extends Rectangle{
  rotationSpeed = 20;
  rotation = Math.random() * 180;
  speed = {x: 0, y: 0};
  refreshRate = 15;
  lastUpdate = Date.now();
  damage = 5;

  constructor(id, source, x, y, speed, color) {
    super(x, y, Bullet.size, Bullet.size);
    this.id = id;
    this.source = source;
    this.speed = speed;
    this.color = color;
  }

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(this.x + Bullet.size / 2, this.y + Bullet.size / 2);
    // rotate the rect
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-Bullet.size / 2, -Bullet.size / 2, Bullet.size, Bullet.size);
    ctx.stroke();
    ctx.restore();
  };

  update = (controls, world) => {
    // Calculate time delta for animation:
    let now = Date.now();
    let delta = (now - this.lastUpdate) / this.refreshRate;
    this.lastUpdate = now;

    this.x += this.speed.x;
    this.y += this.speed.y;
    this.rotation += this.rotationSpeed;
  };

  serialize = () => {
    let res = {};
    res.id = this.id;
    res.source = this.source;
    res.x = this.x;
    res.y = this.y;
    res.damage = this.damage;
    res.speed = this.speed;
    return res;
  };
}

Bullet.size = 15;
