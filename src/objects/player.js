import Bullet from "./bullet.js";
import Rectangle from "./rectangle.js";
import SkinManager from "../client-objects/skin-manager.js";

const g = 0.5;  //TODO

export default class Player extends Rectangle {

  constructor(id, x, y, name, skin) {
    let size = 50;
    super(x, y, size, size);

    this.bulletSpeed = 15;
    this.fireInterval = 30;
    this.friction = 0.9;
    this.speed = {x: 7, y: -15};
    this.jumpTimeout = null;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.bulletIndex = 0;
    this.score = 0;
    this.eyes = {x: 10, y: 10, size: 10, margin: 5};
    this.velocity = {x: 0, y: 0};
    this.isOnGround = false;
    this.isOnWall = false;
    this.wallDir = null;
    this.fireTimer = 0;
    this.lastControls = {};
    this.controls = {};
    this.mousePosition = {x: 250, y: 250};

    this.size = size;
    this.id = id;
    this.name = name;
    this.skin = skin;
  }

  draw(ctx){
    // Draw the player name:
    ctx.font = "16px 'Jura'";
    let stringLen = this.name.length * 9.5;
    ctx.strokeStyle = 'black';
    ctx.strokeText(this.name, this.x + (this.size / 2) - (stringLen / 2), this.y + this.size + 15);
    ctx.fillStyle = 'white';
    ctx.fillText(this.name, this.x + (this.size / 2) - (stringLen / 2), this.y + this.size + 15);

    // Draw the health bar:
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 5);

    ctx.beginPath();
    ctx.fillStyle = SkinManager.playerSkins[this.skin].body;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    this.drawEyes(ctx);
    ctx.stroke();
  };

  drawEyes(ctx){
    ctx.fillStyle = SkinManager.playerSkins[this.skin].eyes;
    ctx.fillRect(this.x + this.eyes.x, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
    ctx.fillRect(this.x + this.eyes.x + this.eyes.size + this.eyes.margin, this.y + this.eyes.y, this.eyes.size, this.eyes.size);
  };

  updateControls(controls) {
    this.controls = controls;
  };

  updateMousePosition(mousePosition) {
    this.mousePosition = mousePosition;
  };

  update(world) {
    if (this.controls.left) this.velocity.x = -this.speed.x;
    else if (this.controls.right) this.velocity.x = this.speed.x;
    else this.velocity.x *= this.friction;

    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;

    this.velocity.y += g * world.delta * world.delta;
    this.isOnGround = false;
    const nextPositionX = {x: this.x + (this.velocity.x * world.delta), y: this.y};
    const nextPositionY = {x: this.x, y: this.y + (this.velocity.y * world.delta)};
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
    this.fireTimer += world.delta;
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

      let bulletID = this.id + this.bulletIndex;
      let bullet = new Bullet(bulletID, this.id, this.x + this.size / 2, this.y + this.size / 2, speed, SkinManager.playerSkins[this.skin].eyes);
      this.bulletIndex++;
      world.addBullet(bullet);
    }

    this.x = nextPositionX.x;
    this.y = nextPositionY.y;

    this.updateEyes();
    this.lastControls = this.controls;
  };

  takeDamage(damage) {
    this.health -= damage;
    return this.health;
  };

  updateEyes() {
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

  respawn(x, y) {
    [this.x, this.y] = [x, y];
    this.health = this.maxHealth;
    //if(this.score > 0) this.score -= 1;
  };

  serialize() {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.hp = this.health;
    res.velocity = this.velocity;
    res.eyes = this.eyes;
    res.isOnGround = this.isOnGround;
    res.isOnWall = this.isOnWall;
    res.wallDir = this.wallDir;
    res.fireTimer = this.fireTimer;
    res.mousePosition = this.mousePosition;
    res.controls = this.controls;
    res.skin = this.skin;
    res.name = this.name;
    res.bulletIndex = this.bulletIndex;
    res.score = this.score;
    return res;
  };

  updateState(state){
    this.id = state.id;
    this.x = state.x;
    this.y = state.y;
    this.health = state.hp;
    this.velocity = state.velocity;
    this.eyes = state.eyes;
    this.isOnGround = state.isOnGround;
    this.isOnWall = state.isOnWall;
    this.wallDir = state.wallDir;
    this.fireTimer = state.fireTimer;
    this.mousePosition = state.mousePosition;
    this.controls = state.controls;
    this.skin = state.skin;
    this.bulletIndex = state.bulletIndex;
    this.name = state.name;
    this.score = state.score;
  };
};
