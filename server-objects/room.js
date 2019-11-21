import World from "../objects/world.js";
import {generateID} from "../objects/utils.js";
import {roomSize} from "../server.js"
import Player from "../objects/player.js";

let baseWidth = 1853;
let baseHeight = 951;
let initialState = {
  players: {},
  spawnPoints : [[100, 100], [baseWidth-100, 100], [baseWidth/3, 100], [2*baseWidth/3, 100]],

  walls: {
    "leftWall": {x: 0, y: 0, width: 50, height: baseHeight, color: "#444"},
    "topWall": {x: 0, y: 0, width: baseWidth, height: 50, color: "#444"},
    "rightWall": {x: baseWidth - 50, y: 0, width: 50, height: baseHeight, color: "#444"},
    "bottomWall": {
      x: 0,
      y: baseHeight - 50,
      width: baseWidth,
      height: 50,
      color: "#444"
    },
    "platform": {
      x: 150,
      y: baseHeight - 300,
      width: 400,
      height: 50,
      color: "#444"
    },
    "platform2": {
      x: baseWidth - 550,
      y: baseHeight - 300,
      width: 400,
      height: 50,
      color: "#444"
    },
    "platform3": {
      x: baseWidth / 2 - 200,
      y: baseHeight - 550,
      width: 400,
      height: 50,
      color: "#444"
    },
  },
};


/* TODO
  broadcast connectToRoom on player exit from waiting.
  when player connects when the room is already started, don't reconnect him
  rooms with different sizes
 */
export default class Room {
  world = null;
  updateInterval = null;
  started = false;

  constructor(id, io) {
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
    this.world.players[socket.id] = new Player(socket.id, 100, 100, playerInfo.playerName, playerInfo.skin);
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

  update = () => {
    this.world.update();
    this.updateRemoteState();
  };

  broadcast = (event, msg)  => {
    this.io.sockets.in(this.id).emit(event, msg);
  };

  updateRemoteState = () => {
    this.broadcast('updateState', this.world.serialize());
  };

  startGame = () => {
    this.broadcast('startGame', this.world.serialize(true));
    this.world.reset();
    this.started = true;
    setInterval(this.update, 15);
  };

  clearUpdateInterval = () => {
    clearInterval(this.updateInterval);
  };
}
