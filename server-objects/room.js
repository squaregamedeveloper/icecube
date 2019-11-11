import World from "../objects/world";
import {generateID} from "../objects/utils";
import Player from "../objects/player";

let baseWidth = 1853;
let baseHeight = 951;
let initialState = {
  players: {},
  walls: {
    "leftWall": {x: 0, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
    "topWall": {x: 0, y: 0, width: baseWidth, height: 50, color: "#9ed8f0"},
    "rightWall": {x: baseWidth - 50, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
    "bottomWall": {
      x: 0,
      y: baseHeight - 50,
      width: baseWidth,
      height: 50,
      color: "#9ed8f0"
    },
    "platform": {
      x: 150,
      y: baseHeight - 300,
      width: baseWidth / 4,
      height: 50,
      color: "#9ed8f0"
    },
  },
};

export default class Room {
  world = null;

  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.world = new World(initialState);
    setInterval(this.update, 15);
  }

  getNumPlayers() {
    let room = this.io.sockets.adapter.rooms[this.id];
    return (room) ? room.length : 0;
  }

  join(socket) {
    socket.join(this.id);
    this.world.players[socket.id] = new Player(socket.id, 100, 100)
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

  update = () => {
    this.world.update();
    this.updateRemoteState();
  };

  broadcast(event, msg) {
    this.io.sockets.in(this.id).emit(event, msg);
  }

  updateRemoteState() {
    this.broadcast('updateState', this.world.serialize());
  }
}
