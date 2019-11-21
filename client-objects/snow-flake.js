export default class SnowFlake {

  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.speed = {x: (-5 + Math.random() * 10), y: (1 + Math.random() * 5)};
    this.size = 2 + Math.random() * 6;
    this.opacity = Math.random();
    this.rotationSpeed = Math.random() * 5;
    this.rotation = Math.random() * 180;

  }

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    // move the rotation point to the center of the rect
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    // rotate the rect
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.stroke();
    ctx.restore();
  };

  update = () => {
    this.x += this.speed.x;
    this.y += this.speed.y;
    if(this.y > window.innerHeight){
      this.y = -100;
      this.x = Math.random() * window.innerWidth;
    }
    this.rotation += this.rotationSpeed;
  }
}
