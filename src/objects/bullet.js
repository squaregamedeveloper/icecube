import Rectangle from "./rectangle.js";
export default class Bullet extends Rectangle{

  constructor(id, source, x, y, speed, color) {
    super(x, y, Bullet.size, Bullet.size);

    this.rotationSpeed = -10;
    this.rotation = Math.random() * 180;
    this.speed = {x: 0, y: 0};
    this.damage = 1;

    this.id = id;
    this.source = source;
    this.speed = speed;
    this.color = color;
  }

  draw(ctx){
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(this.x + Bullet.size / 2, this.y + Bullet.size / 2);
    // rotate the rect
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = "black";
    ctx.fillRect((-Bullet.size / 2) - 1 , (-Bullet.size / 2) - 1, Bullet.size + 2, Bullet.size + 2);
    ctx.fillStyle = this.color;
    ctx.fillRect(-Bullet.size / 2, -Bullet.size / 2, Bullet.size, Bullet.size);
    ctx.stroke();
    ctx.restore();
  };

  update(world){
    this.x += this.speed.x * world.delta ;
    this.y += this.speed.y * world.delta;
    this.rotation -= this.rotationSpeed * world.delta;
  };

  updateState(state){
    this.x = state.x;
    this.y = state.y;
  };

  serialize(){
    let res = {};
    res.id = this.id;
    res.source = this.source;
    res.x = this.x;
    res.y = this.y;
    res.damage = this.damage;
    res.speed = this.speed;
    res.color = this.color;
    return res;
  };
}

Bullet.size = 15;
