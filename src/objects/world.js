import Wall from './wall.js';
import Player from './player.js';
import Bullet from "./bullet.js";
import FragmentCluster from "./fragments.js"
import Icicle from "./icicle.js";
import {generateID} from "./utils.js";

export default class World {

  constructor(initialState, isClient) {
    this.client = isClient;

    this.refreshRate = 15;
    this.lastUpdate = Date.now();
    this.spawnPointCounter = 0;

    this.walls = [];
    for (let wall_id in initialState.walls) {
      let id = wall_id;
      let {x, y, width, height, skin, platform} = initialState.walls[id];
      this.walls.push(new Wall(id, x, y, width, height, skin, platform))
    }

    this.spawnPoints = [];
    for (let spawnPoint of initialState.spawnPoints) {
      this.spawnPoints.push(spawnPoint)
    }

    this.players = {};
    for (let player_id in initialState.players) {
      let {x, y, name, skin} = initialState.players[player_id];
      this.players[player_id] = new Player(player_id, x, y, name, skin);
    }

    this.bullets = {};
    this.icicles = {};
    this.fragmentClusters = [];
  }

  reset() {
    this.lastUpdate = Date.now();
  };

  addBullet(bullet) {
    this.bullets[bullet.id] = bullet;
  };

  addIcicle() {
    let id = generateID();
    let platforms = this.walls.filter(w => w.platform);
    let index = Math.floor(Math.random() * platforms.length);
    let platform = platforms[index];
    let y = platform.y + platform.height;
    let x = Math.floor((Math.random() * (platform.width - 40))) + platform.x + 10;
    this.icicles[id] = new Icicle(id, x, y);

    let randSpawnTime = Math.floor(Math.random() * 3000);
    setTimeout(() => this.addIcicle(), randSpawnTime);
  }

  updatePlayerPositions() {
    for (let player_id in this.players) {
      let player = this.players[player_id];
      // Reset player;
      if (player.health <= 0 && !this.client) {
        let spawnPoint = this.getSpawnPoint();
        player.respawn(spawnPoint[0], spawnPoint[1]);
      }
      player.update(this);
    }
  };

  getSpawnPoint(){
    this.spawnPointCounter = (this.spawnPointCounter + 1) % this.spawnPoints.length;
    return this.spawnPoints[this.spawnPointCounter];
  }

  updatefragmentClusters() {
    for (let i = 0; i < this.fragmentClusters.length; i++) {
      let f = this.fragmentClusters[i];
      f.update();
      if (f.isFinished()) {
        this.fragmentClusters.splice(i, 1);
        i--;
      }
    }
  };

  updateBulletsPosition() {
    for (let bulletID in this.bullets) {
      let b = this.bullets[bulletID];
      b.update(this);
      let intersection = this.intersectsWalls(b);
      if (intersection) {
        delete this.bullets[bulletID];
        if(this.client) this.fragmentClusters.push(new FragmentCluster(b.x, b.y, intersection));
        break;
      }

      for (let id in this.players) {
        if (id === b.source) continue;
        let player = this.players[id];
        let intersects = player.intersects(b);
        if (intersects) {
          if (player.takeDamage(b.damage) <= 0) {
            this.players[b.source].score++;
          }
          delete this.bullets[bulletID];
          if(this.client) this.fragmentClusters.push(new FragmentCluster(b.x, b.y, intersects));
          break;
        }
      }
    }
  };

  updateIcicles() {
    for (let icicleID in this.icicles) {
      let icicle = this.icicles[icicleID];
      icicle.update(this);
      let intersects = this.intersectsWalls(icicle);

      // Destroy the icicle if it hits a platform:
      if(intersects){
        if(this.client) this.fragmentClusters.push(new FragmentCluster(icicle.x, icicle.y+icicle.height, intersects, 30, 20));
        delete this.icicles[icicleID];
      }

      for (let id in this.players) {
        let player = this.players[id];
        let intersects = player.intersects(icicle);
        if (intersects) {
          player.takeDamage(icicle.damage);
          delete this.icicles[icicleID];
          if(this.client) this.fragmentClusters.push(new FragmentCluster(icicle.x, icicle.y, intersects));
        }
      }
    }
  }

  updatePlayerControls(playerID, controls) {
    this.players[playerID].updateControls(controls);
  };

  updatePlayerMouse(playerID, mousePosition) {
    this.players[playerID].updateMousePosition(mousePosition);
  };

  update() {
    // Calculate time delta for animation:
    let now = Date.now();
    this.delta = (now - this.lastUpdate) / this.refreshRate;
    this.lastUpdate = now;

    this.updateBulletsPosition();
    this.updatePlayerPositions();
    this.updateIcicles();

    // Handle fragments only on client side:
    if(this.client) this.updatefragmentClusters();
  };

  draw(ctx) {
    this.walls.forEach((w) => w.draw(ctx));
    this.fragmentClusters.forEach((fc) => fc.draw(ctx));
    for (let bulletID in this.bullets) this.bullets[bulletID].draw(ctx);
    for (let icicleID in this.icicles) this.icicles[icicleID].draw(ctx);
    for (let player_id in this.players) this.players[player_id].draw(ctx);
  };

  intersectsWalls(rect) {
    let intersects = null;
    for (let w of this.walls) {
      intersects = w.intersects(rect);
      if (intersects) return intersects;
    }
    return intersects;
  };

  serialize(initial = false) {
    let res = {
      "players": {},
      "bullets": [],
      "icicles": [],
      "walls": [],
      "spawnPoints": [],
      "spawnPointCounter": this.spawnPointCounter
    };
    if (initial) {
      for (let wall of this.walls) res["walls"].push(wall.serialize());
      for (let spawnPoint of this.spawnPoints) res["spawnPoints"].push(spawnPoint);
    }
    for (let bulletID in this.bullets) res["bullets"].push(this.bullets[bulletID].serialize());
    for (let icicleID in this.icicles) res["icicles"].push(this.icicles[icicleID].serialize());
    for (let player_id in this.players) res["players"][player_id] = (this.players[player_id].serialize());
    return res;
  };

  updateState(state) {
    // Update players (and delete them in case of player leave):
    for (let player_id in state['players']) {
      this.players[player_id].updateState(state['players'][player_id])
    }

    for (let player_id in this.players) {
      if (!(player_id in state['players'])) {
        delete this.players[player_id];
      }
    }

    // Update bullets:
    for (let bullet of state.bullets) {
      let {source, x, y, speed, color} = bullet;

      if (this.players[source]) {
        if(!this.bullets[bullet.id]) this.bullets[bullet.id] = new Bullet(bullet.id, source, x, y, speed, color);
        else this.bullets[bullet.id].updateState(bullet)
      } else {
        delete this.bullets[bullet["id"]];
      }
    }

    // Update icicles:
    for (let icicle of state.icicles) {
      let {id, x, y, width, height, isFalling, velocity} = icicle;
      this.icicles[id] = new Icicle(id, x, y, width, height, isFalling, velocity);
    }

    // Update spawn points counter
    this.spawnPointCounter = state["spawnPointCounter"]
  };
}
