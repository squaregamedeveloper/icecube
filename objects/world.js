class World {
  constructor(initialState) {
    this.walls = [];
    for (let wall_id in initialState.walls){
      let id = wall_id;
      let {x, y, width, height, color} = initialState.walls[id];
      this.walls.push(new Wall(id, x, y, width, height, color))
    }

    this.players = [];
    for (let player_id in initialState.players){
      let id = player_id;
      let {x, y} = initialState.players[id];
      this.players.push(new Player(id, x, y))
    }

    this.bullets = [];
    this.fragmentClusters = [];
  }

  addBullet = (bullet) => {
    this.bullets.push(bullet);
  };

  updatePlayerPositions = () => {
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i];
      player.update(controls, this);
    }
  };

  updatefragmentClusters = () => {
    for (let i = 0; i < this.fragmentClusters.length; i++) {
      let f = this.fragmentClusters[i];
      f.update();
      if (f.isFinished()) {
        this.fragmentClusters.splice(i, 1);
        i--;
      }
    }
  };

  updateBulletsPosition = () => {
    for (let i = 0; i < this.bullets.length; i++) {
      let b = this.bullets[i];
      b.update();
      let intersection = this.intersects(b.x, b.y, Bullet.size, Bullet.size)
      if (intersection) {
        this.bullets.splice(i, 1);
        this.fragmentClusters.push(new FragmentCluster(b.x, b.y, intersection));
        i--;
      }
    }
  };

  update = () => {
    this.updateBulletsPosition();
    this.updatefragmentClusters();
    this.updatePlayerPositions();
  };

  draw = () => {
    this.walls.forEach((w) => w.draw());
    this.players.forEach((player) => player.draw());
    this.bullets.forEach((b) => b.draw());
    this.fragmentClusters.forEach((fc) => fc.draw());
  };

  intersects = (x, y, width, height) => {
    let intersects = null;
    for (let w of this.walls) {
      intersects = w.intersects(x, y, width, height);
      if (intersects) return intersects;
    }
    return intersects;
  }
}
