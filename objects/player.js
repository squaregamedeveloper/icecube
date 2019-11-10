class Player {
  x = 150;
  y = 200;
  size = 50;
  eyes = {x: 10, y: 10, size: 10, margin: 5};
  velocity = {x: 0, y: 0};
  speed = {x: 7, y: -15};
  friction = 0.9;
  isOnGround = false;
  isOnWall = false;
  wallDir = null;
  bulletSpeed = 15;
  fireInterval = 10;
  fireTimer = 0;
  jumpTimeout = null;
  lastControls = {};

  constructor(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;
  }

  draw = () => {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size, this.size);
    this.drawEyes();
    ctx.stroke();
  };

  drawEyes = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + this.eyes.x, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
    ctx.fillRect(this.x + this.eyes.x + this.eyes.size + this.eyes.margin, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
  };


  update = (controls, world) => {
    if (controls.left) this.velocity.x = -this.speed.x;
    else if (controls.right) this.velocity.x = this.speed.x;
    else {
      this.velocity.x *= this.friction;
    }

    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;

    this.velocity.y += g;
    this.isOnGround = false;
    const nextPositionX = {x: this.x + this.velocity.x, y: this.y};
    const nextPositionY = {x: this.x, y: this.y + this.velocity.y};
    let intersectsX = world.intersects(nextPositionX.x, nextPositionX.y, this.size, this.size);
    let intersectsY = world.intersects(nextPositionY.x, nextPositionY.y, this.size, this.size);
    if (intersectsX) {
      if (this.velocity.x < 0) {
        nextPositionX.x = intersectsX["x"] + intersectsX["width"];
        this.wallDir = "left";
      }
      if (this.velocity.x > 0) {
        nextPositionX.x = intersectsX["x"] - this.size;
        this.wallDir = "right";
      }

      this.velocity.x = 0;
      this.velocity.y *= 0.8;
      this.isOnWall = true;
      clearTimeout(this.jumpTimeout);
      this.jumpTimeout = setTimeout(() => {
        this.isOnWall = false;
      }, 300);
    }
    if (intersectsY) {
      if (this.velocity.y > 0) {
        nextPositionY.y = intersectsY["y"] - this.size;
        this.isOnGround = true;
      } else if (this.velocity.y < 0) nextPositionY.y = intersectsY["y"] + intersectsY["height"];

      this.velocity.y = 0;
    }

    if (this.isOnGround) {
      this.velocity.y = 0;
      if (controls.up) this.velocity.y = this.speed.y;
    }
    else if (this.isOnWall) {
      if ((/*!this.lastControls.up &&*/ controls.up && controls.left && !controls.right && this.wallDir === "right") ||
      (/*!this.lastControls.up && */controls.up && controls.right && !controls.left && this.wallDir === "left")) {
        this.velocity.y = this.speed.y;
        this.isOnWall = false;
      }
    }
    this.fireTimer += 1;
    if (controls.shoot && this.fireTimer >= this.fireInterval) {
      this.fireTimer = 0;
      let dir = {x: (mousePosition.x - (this.x + (this.size / 2)) + (Bullet.size / 2)),
        y: (mousePosition.y - (this.y + (this.size / 2) + (Bullet.size / 2)))};
      let mouseDistance = Math.hypot(dir.x, dir.y);
      dir.x /= mouseDistance;
      dir.y /= mouseDistance;
      let speed = {x: dir.x * this.bulletSpeed, y: dir.y * this.bulletSpeed};

      let bullet = new Bullet(generateID(), this.x + this.size / 2, this.y + this.size / 2, speed);
      world.addBullet(bullet);
    }

    this.x = nextPositionX.x;
    this.y = nextPositionY.y;

    this.updateEyes();
    this.lastControls = controls.getControls()
  };

  updateEyes = () => {
    let eyeX, eyeY;
    let y = mousePosition.y - this.eyes.size;

    // Check if the mouse is above or below the player
    if (y < this.y + this.eyes.margin) eyeY = this.y + this.eyes.margin;
    else if (y > this.y + this.size - this.eyes.size - this.eyes.margin) eyeY = this.y + this.size - this.eyes.size - this.eyes.margin;
    else eyeY = y;

    // Check if the mouse is to the left or right of the player
    let x = mousePosition.x - this.eyes.size - this.eyes.margin;
    if (x < this.x + this.eyes.margin) eyeX = this.x + this.eyes.margin;
    else if (x > this.x + this.size - 2 * (this.eyes.size + this.eyes.margin)) eyeX = this.x + this.size - 2 * (this.eyes.size + this.eyes.margin);
    else eyeX = x;

    this.eyes.x += (eyeX - (this.x + this.eyes.x)) * 0.3;
    this.eyes.y += (eyeY - (this.y + this.eyes.y)) * 0.3;
  }
}
