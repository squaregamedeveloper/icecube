import World from "../objects/world.js";
import {roomSize} from "../server.js"
import Player from "../objects/player.js";

let baseWidth = 1853;
let baseHeight = 951;
let initialState = {
  players: {},
  spawnPoints: [[100, 100], [baseWidth - 200, 100], [100, baseHeight - 200], [baseWidth - 200, baseHeight - 200]],

  walls: {
    "leftWall": {x: 0, y: 0, width: 50, height: baseHeight, skin: "grey"},
    "topWall": {x: 0, y: 0, width: baseWidth, height: 50, skin: "grey"},
    "rightWall": {x: baseWidth - 50, y: 0, width: 50, height: baseHeight, skin: "grey"},
    "bottomWall": {
      x: 0,
      y: baseHeight - 50,
      width: baseWidth,
      height: 50,
      skin: "grey"
    },
    "thickLeft": {
      x: 0,
      y: baseHeight / 2 - 100,
      width: 400,
      height: 200,
      skin: "grey"
    },
    "thickRight": {
      x: baseWidth - 400,
      y: baseHeight / 2 - 100,
      width: 400,
      height: 200,
      skin: "grey"
    },
    "thickTop": {
      x: baseWidth / 2 - 100,
      y: 50,
      width: 200,
      height: 250,
      skin: "grey"
    },
    "squareTop1": {
      x: baseWidth / 2 - 199,
      y: 200,
      width: 100,
      height: 100,
      skin: "grey"
    },
    "squareTop2": {
      x: baseWidth / 2 + 99,
      y: 200,
      width: 100,
      height: 100,
      skin: "grey"
    },
    "thickBottom": {
      x: baseWidth / 2 - 100,
      y: baseHeight - 300,
      width: 200,
      height: 250,
      skin: "grey"
    },
    "squareBottom1": {
      x: baseWidth / 2 - 199,
      y: baseHeight - 300,
      width: 100,
      height: 100,
      skin: "grey"
    },
    "squareBottom2": {
      x: baseWidth / 2 + 99,
      y: baseHeight - 300,
      width: 100,
      height: 100,
      skin: "grey"
    },
    "platform": {
      x: 300,
      y: baseHeight - 250,
      width: 300,
      height: 50,
      skin: "ice-platform",
      platform: true
    },
    "platform2": {
      x: baseWidth - 550,
      y: baseHeight - 300,
      width: 300,
      height: 50,
      skin: "ice-platform",
      platform: true
    },
    "platform3": {
      x: baseWidth / 2 - 150,
      y: baseHeight / 2 - 25,
      width: 300,
      height: 50,
      skin: "ice-platform",
      platform: true
    },
  },
};


/* TODO
  broadcast connectToRoom on player exit from waiting.
  when player connects when the room is already started, don't reconnect him
  rooms with different sizes
 */
export default class Room {


  constructor(id, io) {
    this.updateInterval = null;
    this.started = false;

    this.id = id;
    this.io = io;
    this.world = new World(initialState);
  }

  getNumPlayers() {
    let room = this.io.sockets.adapter.rooms[this.id];
    return (room) ? room.length : 0;
  }

  join(socket, playerInfo) {
    socket.join(this.id);
    let spawnPoint = this.world.getSpawnPoint();
    this.world.players[socket.id] = new Player(socket.id, spawnPoint[0], spawnPoint[1], playerInfo.playerName, playerInfo.skin);
    this.broadcast("connectedToRoom", {"id": this.id, "numConnected": this.getNumPlayers(), "roomSize": roomSize});
  }

  kick(socket) {
    delete this.world.players[socket.id];
  }

  updateUserMouse(userID, mousePosition) {
    this.world.updatePlayerMouse(userID, mousePosition);
  }

  updateUserControls(userID, controls) {
    this.world.updatePlayerControls(userID, controls);
  }

  update() {
    this.world.update();
  };

  broadcast(event, msg) {
    this.io.sockets.in(this.id).emit(event, msg);
  };

  updateRemoteState() {
    this.broadcast('updateState', this.world.serialize());
  };

  startGame() {
    this.broadcast('startGame', this.world.serialize(true));
    this.world.reset();
    this.started = true;

    setTimeout(() => this.world.addIcicle(), 1000);
    setInterval(() => this.update(), 15);
    setInterval(() => this.updateRemoteState(), 15);
  };

  clearUpdateInterval() {
    clearInterval(this.updateInterval);
  };
}
