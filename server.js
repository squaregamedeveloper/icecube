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

// Define routes:
app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: __dirname});
});
let roomSize = 8;
let rooms = {};


// Define socket io events:
var roomnumber = 0;
let roomName = "room-" + roomnumber;
io.on('connection', function (socket) {

  // Get player params
  let playerInfo = {
    playerName: socket.handshake.query.playerName,
    color: socket.handshake.query.color
  }
  console.log(playerInfo.color);

  // Handle room logic:
  roomName = "room-" + roomnumber;
  let room = rooms[roomName];
  // If room exists and full
  if (!room || room.getNumPlayers() >= roomSize) {
    roomnumber++;
    roomName = "room-" + roomnumber;
    rooms[roomName] = new Room(roomName, io);
  }
  console.log(`Player ${playerInfo.playerName} connected from room ${roomName}`);
  rooms[roomName].join(socket, playerInfo);


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
    });
  })(rooms[roomName], socket);


  //Send this event to everyone in the room.
  io.sockets.in(roomName).emit('connectToRoom', rooms[roomName].world.serialize(true));
  //console.table(rooms)
});

server.listen(3000);
