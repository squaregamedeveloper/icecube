import World from "../objects/world";

let baseWidth = 1853;
let baseHeight = 951;
let initialState = {
  players: {
    player1_id: {
      x: 150,
      y: 200
    }
  },
  walls: {
    "leftWall": {x: 0, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
    "topWall": {x: 0, y: 0, width: baseWidth, height: 50, color: "#9ed8f0"},
    "rightWall": {x: baseWidth - 50, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
    "bottomWall": {
      x: 0,
      y: baseHeight - 50,
      width: baseWidth,
      height: 50,
      color: "red"
    },
    "platform": {
      x: 150,
      y: baseHeight - 300,
      width: baseWidth / 4,
      height: 50,
      color: "red"
    },
  },
};

class Room {
  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.world = new World(initialState);
  }

  getNumPlayers() {
    let room = this.io.sockets.adapter.rooms[this.id];
    return (room) ? room.length : 0;
  }

  broadcast(event, msg) {
    this.io.sockets.in(this.id).emit(event, msg);
  }

  updateState() {
    this.broadcast('updateState', JSON.stringify(this.world));
  }
}


module.exports = Room;
