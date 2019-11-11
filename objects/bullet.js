export default class Bullet {
  x = 0;
  y = 0;
  rotationSpeed = 20;
  rotation = Math.random() * 180;
  speed = {x: 0, y: 0};

  constructor(id, x, y, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(this.x + Bullet.size / 2, this.y + Bullet.size / 2);
    // rotate the rect
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = "black";
    ctx.fillRect(-Bullet.size / 2, -Bullet.size / 2, Bullet.size, Bullet.size);
    ctx.stroke();
    ctx.restore();
  };

  update = (controls, world) => {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.rotation += this.rotationSpeed;
  };

  serialize = () => {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.speed = this.speed;
    return res;
  };
}

Bullet.size = 15;
