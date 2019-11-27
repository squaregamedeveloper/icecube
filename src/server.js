import Room from "./server-objects/room";

require("babel-core").transform("code", {});
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
/*const io = require('socket.io')(server, {
  pingInterval: 8000,
  pingTimeout: 4000,
});*/
const io = require('socket.io')(server);

// Define middlewares:
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/objects', express.static(__dirname + '/objects'));
app.use('/client-objects', express.static(__dirname + '/client-objects'));

// Define routes:
app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: __dirname});
});
export let roomSize = 2;
let rooms = {};

// Define socket io events:
let roomnumber = 0;
let roomName = "room-" + roomnumber;
io.on('connection', function (socket) {

  // Get player params
  let playerInfo = {
    playerName: socket.handshake.query.playerName,
    skin: socket.handshake.query.skin
  };

  // Handle room logic:
  roomName = "room-" + roomnumber;
  let room = rooms[roomName];

  // If room exists and full
  if (!room || room.getNumPlayers() >= roomSize || room.started) {
    roomnumber++;
    roomName = "room-" + roomnumber;
    rooms[roomName] = new Room(roomName, io);
    room = rooms[roomName];
  }

  // Connect a player to the room
  console.log(`Player ${playerInfo.playerName} connected from room ${roomName}`);
  room.join(socket, playerInfo);

  // Room is full
  if(room.getNumPlayers() === roomSize) room.startGame();

  ((room, socket) => {
    socket.on('updateControls', (controls) => {
      room.updateUserControls(socket.id, controls);
    });

    socket.on('updateMouse', (mousePosition) => {
      room.updateUserMouse(socket.id, mousePosition);
    });
    socket.on('disconnect', () => {
      console.log(`Player ${socket.id} disconnected from room ${room.id}`);
      room.kick(socket);
      if(room.getNumPlayers() == 0){
        rooms[room.id].clearUpdateInterval();
        delete rooms[room.id];
      }
    });
  })(rooms[roomName], socket);

});
const PORT = process.env.PORT || 3000;
server.listen(PORT, err => {
  if(err) throw err;
  console.log("%c Server running", "color: green");
});
