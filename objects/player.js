import Bullet from "./bullet.js";
import Rectangle from "./rectangle.js";
import {generateID, LightenDarkenColor} from "./utils.js";

const g = 9.8 / 16;  //TODO


export default class Player extends Rectangle {
  bulletSpeed = 15;
  fireInterval = 30;
  friction = 0.9;
  speed = {x: 7, y: -15};
  jumpTimeout = null;
  lastUpdate = Date.now();
  refreshRate = 15;
  hp = 20;

  eyes = {x: 10, y: 10, size: 10, margin: 5};
  velocity = {x: 0, y: 0};
  isOnGround = false;
  isOnWall = false;
  wallDir = null;
  fireTimer = 0;
  lastControls = {};
  controls = {};
  mousePosition = {x: 250, y: 250};

  constructor(id, x, y, name, color) {
    let size = 50;
    super(x, y, size, size);
    this.size = size;
    this.id = id;
    this.name = name;
    this.color = color;
    this.eyesColor = LightenDarkenColor(color, 20);
  }

  draw = (ctx) => {
    // Draw the player name:
    ctx.font = "10px Arial";
    ctx.fillStyle = 'black';
    let stringLen = this.name.length * 6.2;
    ctx.fillText(this.name + " : " + this.hp, this.x + (this.size / 2) - (stringLen / 2), this.y - 10);

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    this.drawEyes(ctx);
    ctx.stroke();
  };

  drawEyes = (ctx) => {
    ctx.fillStyle = this.eyesColor;
    ctx.fillRect(this.x + this.eyes.x, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
    ctx.fillRect(this.x + this.eyes.x + this.eyes.size + this.eyes.margin, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
  };

  updateControls = (controls) => {
    this.controls = controls;
  };

  updateMousePosition = (mousePosition) => {
    // if (typeof (exports) !== undefined) console.log(this.mousePosition);
    this.mousePosition = mousePosition;
  };

  update = (world) => {
    // Calculate time delta for animation:
    let now = Date.now();
    let delta = (now - this.lastUpdate) / this.refreshRate;
    this.lastUpdate = now;

    if (this.controls.left) this.velocity.x = -this.speed.x;
    else if (this.controls.right) this.velocity.x = this.speed.x;
    else this.velocity.x *= this.friction;

    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;

    this.velocity.y += g;
    this.isOnGround = false;
    const nextPositionX = {x: this.x + (this.velocity.x * delta), y: this.y};
    const nextPositionY = {x: this.x, y: this.y + (this.velocity.y * delta)};
    let intersectsX = world.intersectsWalls(new Rectangle(nextPositionX.x, nextPositionX.y, this.size, this.size));
    let intersectsY = world.intersectsWalls(new Rectangle(nextPositionY.x, nextPositionY.y, this.size, this.size));
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
      if ((/*!this.lastControls.up &&*/ this.controls.up && this.controls.left && !this.controls.right && this.wallDir === "right") ||
        (/*!this.lastControls.up &&*/ this.controls.up && this.controls.right && !this.controls.left && this.wallDir === "left")) {
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

      let bullet = new Bullet(generateID(), this.id, this.x + this.size / 2, this.y + this.size / 2, speed);
      world.addBullet(bullet);
    }

    this.x = nextPositionX.x;
    this.y = nextPositionY.y;

    this.updateEyes();
    this.lastControls = this.controls;
  };

  takeDamage = (damage) => {
    this.hp -= damage;
  };

  updateEyes = () => {
    let eyeX, eyeY;
    let y = this.mousePosition.y - this.eyes.size;

    // Check if the mouse is above or below the player
    if (y < this.y + this.eyes.margin) eyeY = this.y + this.eyes.margin;
    else if (y > this.y + this.size - this.eyes.size - this.eyes.margin) eyeY = this.y + this.size - this.eyes.size - this.eyes.margin;
    else eyeY = y;

    // Check if the mouse is to the left or right of the player
    let x = this.mousePosition.x - this.eyes.size - this.eyes.margin;
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
    res.hp = this.hp;
    res.velocity = this.velocity;
    res.eyes = this.eyes;
    res.isOnGround = this.isOnGround;
    res.isOnWall = this.isOnWall;
    res.wallDir = this.wallDir;
    res.fireTimer = this.fireTimer;
    res.mousePosition = this.mousePosition;
    res.controls = this.controls;
    res.color = this.color;
    res.eyesColor = this.eyesColor;
    res.name = this.name;
    return res;
  };

  updateState = (state) => {
    this.id = state.id;
    this.x = state.x;
    this.y = state.y;
    this.hp = state.hp;
    this.velocity = state.velocity;
    this.eyes = state.eyes;
    this.isOnGround = state.isOnGround;
    this.isOnWall = state.isOnWall;
    this.wallDir = state.wallDir;
    this.fireTimer = state.fireTimer;
    this.mousePosition = state.mousePosition;
    this.controls = state.controls;
    this.color = state.color;
    this.eyesColor = state.eyesColor;
    this.name = state.name;
  }
};
