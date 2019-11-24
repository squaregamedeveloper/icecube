import Wall from './wall.js';
import Player from './player.js';
import Bullet from "./bullet.js";
import FragmentCluster from "./fragments.js"

export default class World {


  constructor(initialState, isClient) {
    this.client = isClient;

    this.refreshRate = 15;
    this.lastUpdate = Date.now();
    this.spawnPointCounter = 0;

    this.walls = [];
    for (let wall_id in initialState.walls) {
      let id = wall_id;
      let {x, y, width, height, color} = initialState.walls[id];
      this.walls.push(new Wall(id, x, y, width, height, color))
    }

    this.spawnPoints = [];
    for(let spawnPoint of initialState.spawnPoints){
      this.spawnPoints.push(spawnPoint)
    }

    this.players = {};
    for (let player_id in initialState.players) {
      let {x, y, name, skin} = initialState.players[player_id];
      this.players[player_id] = new Player(player_id, x, y, name, skin);
    }

    this.bullets = {};
    this.fragmentClusters = [];
  }

  reset() {
    this.lastUpdate = Date.now();
  };

  addBullet(bullet) {
    this.bullets[bullet.id] = bullet;
  };

  updatePlayerPositions() {
    for (let player_id in this.players) {
      let player = this.players[player_id];
      // Reset player;
      if(player.hp <= 0 && !this.client){
        this.spawnPointCounter = (this.spawnPointCounter + 1) % this.spawnPoints.length;
        let spawnPoint = this.spawnPoints[this.spawnPointCounter];
        player.respawn(spawnPoint[0], spawnPoint[1]);
      }
      player.update(this);
    }
  };

  updatefragmentClusters(){
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
        this.fragmentClusters.push(new FragmentCluster(b.x, b.y, intersection));
        break;
      }

      for (let id in this.players) {
        if(id === b.source) continue;
        let player = this.players[id];
        let intersects = player.intersects(b);
        if (intersects) {
          if(player.takeDamage(b.damage) <= 0) {
            this.players[b.source].score++;
          }
          delete this.bullets[bulletID];
          this.fragmentClusters.push(new FragmentCluster(b.x, b.y, intersects));
          break;
        }
      }
    }
  };

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
    this.updatefragmentClusters();
    this.updatePlayerPositions();
  };

  draw(ctx) {
    this.walls.forEach((w) => w.draw(ctx));
    this.fragmentClusters.forEach((fc) => fc.draw(ctx));
    for (let bulletID in this.bullets) this.bullets[bulletID].draw(ctx);
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
      "walls": [],
      "spawnPoints": [],
      "spawnPointCounter": this.spawnPointCounter
    };
    if (initial){
      for (let wall of this.walls) res["walls"].push(wall.serialize());
      for (let spawnPoint of this.spawnPoints) res["spawnPoints"].push(spawnPoint);
    }
    for (let bulletID in this.bullets) res["bullets"].push(this.bullets[bulletID].serialize());
    for (let player_id in this.players) res["players"][player_id] = (this.players[player_id].serialize());
    return res;
  };

  updateState(state) {
    for (let player_id in state['players']) {
      this.players[player_id].updateState(state['players'][player_id])
    }
    for (let player_id in this.players){
      if (!(player_id in state['players'])){
        delete this.players[player_id];
      }
    }
    // TODO: Change bullet replacement to update
    //this.bullets = {};
    for (let bullet of state.bullets) {
      let {source, x, y, speed, color} = bullet;
      if (this.players[source]){
        this.bullets[bullet["id"]] = new Bullet(bullet["id"], source, x, y, speed, color)
      }
      else{
        delete this.bullets[bullet["id"]];
      }
    }

    // Update spawn points counter
    this.spawnPointCounter = state["spawnPointCounter"]
  };
}
