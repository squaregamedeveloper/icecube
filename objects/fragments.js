class FragmentCluster {
  frags = [];
  maxSize = 6;
  speed = 5;
  rotationSpeed = 7;
  alpha = 255;

  constructor(x, y, intersectionDirections, count = 10, alphaDecay = 5) {
    this.alphaDecay = alphaDecay;
    for (let i = 0; i <= count; i++) {
      let speed = {x: 0, y: 0};
      if (intersectionDirections.bottom || intersectionDirections.top) {
        speed.x = this.randomInRange(-this.speed, this.speed);
        speed.y = (intersectionDirections.bottom) ? this.randomInRange(0, this.speed) : this.randomInRange(-this.speed, 0);
      }
      else if (intersectionDirections.right || intersectionDirections.left) {
        speed.y = this.randomInRange(-this.speed, this.speed);
        speed.x = (intersectionDirections.right) ? this.randomInRange(0, this.speed) : this.randomInRange(-this.speed, 0);
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

  randomInRange = (a, b) => {
    return Math.random() * (b - a) + a;
  };

  update = () => {
    for (let f of this.frags) {
      f.x += f.speed.x;
      f.y += f.speed.y;
      f.rotation += f.rotationSpeed;
    }

    this.alpha -= this.alphaDecay;
  };

  isFinished = () => (this.alpha <= 20);

  draw = () => {
    for (let f of this.frags) {
      ctx.save();
      ctx.beginPath();
      // move the rotation point to the center of the rect
      ctx.translate(f.x + f.size / 2, f.y + f.size / 2);
      // rotate the rect
      ctx.rotate(f.rotation * Math.PI / 180);
      ctx.fillStyle = `#75aedc${(this.alpha).toString(16)}`;
      ctx.fillRect(-f.size / 2, -f.size / 2, f.size, f.size);
      ctx.stroke();
      ctx.restore();
    }
  }
}
