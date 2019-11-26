export default class FragmentCluster {


  constructor(x, y, intersectionDirections, count = 10, alphaDecay = 6) {

    this.frags = [];
    this.maxSize = 6;
    this.speed = 5;
    this.rotationSpeed = 7;
    this.alpha = 255;
    this.lastUpdate = Date.now();
    this.refreshRate = 15;

    this.alphaDecay = alphaDecay;
    for (let i = 0; i <= count; i++) {
      let speed = {x: 0, y: 0};
      if (intersectionDirections.bottom || intersectionDirections.top) {
        speed.x = this.randomInRange(-this.speed, this.speed);
        speed.y = (intersectionDirections.bottom) ? this.randomInRange(1, this.speed) : this.randomInRange(-this.speed, -1);
      } else if (intersectionDirections.right || intersectionDirections.left) {
        speed.y = this.randomInRange(-this.speed, this.speed);
        speed.x = (intersectionDirections.right) ? this.randomInRange(1, this.speed) : this.randomInRange(-this.speed, -1);
      }
      this.frags.push({
        x: x,
        y: y,
        speed: speed,
        size: (Math.random() * this.maxSize) + 1,
        rotationSpeed: (Math.random() * this.rotationSpeed) + 1,
        rotation: Math.random() * 180
      })
    }
  }

  randomInRange(a, b) {
    return Math.random() * (b - a) + a;
  };

  update() {
    // Calculate time delta for animation:
    let now = Date.now();
    let delta = (now - this.lastUpdate) / this.refreshRate;
    this.lastUpdate = now;

    for (let f of this.frags) {
      f.x += f.speed.x * delta;
      f.y += f.speed.y* delta;
      f.rotation += f.rotationSpeed;
    }

    this.alpha -= this.alphaDecay;
  };

  isFinished() { return this.alpha <= 20; };

  draw(ctx) {
    for (let f of this.frags) {
      ctx.save();
      ctx.beginPath();
      // move the rotation point to the center of the rect
      ctx.translate(f.x + f.size / 2, f.y + f.size / 2);
      // rotate the rect
      ctx.rotate(f.rotation * Math.PI / 180);
      ctx.fillStyle = `#555555${(this.alpha).toString(16)}`;
      ctx.fillRect(-f.size / 2, -f.size / 2, f.size, f.size);
      ctx.stroke();
      ctx.restore();
    }
  }
}
