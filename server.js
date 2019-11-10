require("babel-core").transform("code", {});
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  pingInterval: 4000,
  pingTimeout: 4000,
});
const Room = require('./server-objects/room');

// Define middlewares:
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/objects', express.static(__dirname + '/objects'));

// Define routes:
app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: __dirname});
});
let roomSize = 2;
let rooms = {};


// Define socket io events:
var roomnumber = 0;
let roomName = "room-" + roomnumber;
io.on('connection', function (socket) {

  // Handle room logic:
  roomName = "room-" + roomnumber;
  let room = rooms[roomName];
  // If room exists and full
  if (!room || room.getNumPlayers() >= roomSize) {
    roomnumber++;
    roomName = "room-" + roomnumber;
    rooms[roomName] = new Room(roomName, io);
  }
  socket.join(roomName);

  socket.on('disconnect', () => {
    console.log("DISCONNECTED")
  });

  //Send this event to everyone in the room.
  io.sockets.in(roomName).emit('connectToRoom', "You are in room no. " + roomnumber);
});

server.listen(3000);
