import Bullet from "./bullet.js";
import {generateID} from "./utils.js";

const g = 9.8 / 16;


export default class Player {
  bulletSpeed = 15;
  fireInterval = 10;
  friction = 0.9;
  size = 50;
  speed = {x: 7, y: -15};
  jumpTimeout = null;

  x = 150;
  y = 200;
  eyes = {x: 10, y: 10, size: 10, margin: 5};
  velocity = {x: 0, y: 0};
  isOnGround = false;
  isOnWall = false;
  wallDir = null;
  fireTimer = 0;
  lastControls = {};
  controls = {};
  mousePosition = {};

  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  draw = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size, this.size);
    this.drawEyes(ctx);
    ctx.stroke();
  };

  drawEyes = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + this.eyes.x, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
    ctx.fillRect(this.x + this.eyes.x + this.eyes.size + this.eyes.margin, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
  };

  updateControls = (controls) => {
    this.controls = controls;
  };

  updateMousePosition = (mousePosition) => {
    this.mousePosition = mousePosition;
  };

  update = (world) => {
    if (this.controls.left) this.velocity.x = -this.speed.x;
    else if (this.controls.right) this.velocity.x = this.speed.x;
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
      }, 200);
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
      if (this.controls.up) this.velocity.y = this.speed.y;
    } else if (this.isOnWall) {
      if ((/*!this.lastthis.controls.up &&*/ this.controls.up && this.controls.left && !this.controls.right && this.wallDir === "right") ||
        (/*!this.lastthis.controls.up && */this.controls.up && this.controls.right && !this.controls.left && this.wallDir === "left")) {
        this.velocity.y = this.speed.y;
        this.isOnWall = false;
      }
    }
    this.fireTimer += 1;
    if (this.controls.shoot && this.fireTimer >= this.fireInterval) {
      this.fireTimer = 0;
      let dir = {
        x: (this.mousePosition.x - (this.x + (this.size / 2)) + (Bullet.size / 2)),
        y: (this.mousePosition.y - (this.y + (this.size / 2) + (Bullet.size / 2)))
      };
      let mouseDistance = Math.hypot(dir.x, dir.y);
      dir.x /= mouseDistance;
      dir.y /= mouseDistance;
      let speed = {x: dir.x * this.bulletSpeed, y: dir.y * this.bulletSpeed};

      let bullet = new Bullet(generateID(), this.x + this.size / 2, this.y + this.size / 2, speed);
      world.addBullet(bullet);
    }

    this.x = nextPositionX.x;
    this.y = nextPositionY.y;

    this.updateEyes(this.mousePosition);
    this.lastcontrols = this.controls;
  };

  updateEyes = (mousePosition) => {
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
  };

  serialize = () => {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.velocity = this.velocity;
    res.eyes = this.eyes;
    res.isOnGround = this.isOnGround;
    res.isOnWall = this.isOnWall;
    res.wallDir = this.wallDir;
    res.fireTimer = this.fireTimer;
    return res;
  };

  updateState = (state) => {
    this.id = state.id;
    this.x = state.x;
    this.y = state.y;
    this.velocity = state.velocity;
    this.eyes = state.eyes;
    this.isOnGround = state.isOnGround;
    this.isOnWall = state.isOnWall;
    this.wallDir = state.wallDir;
    this.fireTimer = state.fireTimer;
  }
};
