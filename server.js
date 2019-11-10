const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Define middlewares:
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/objects', express.static(__dirname + '/objects'));

// Define routes:
app.get('/', function (req, res) {
  res.sendFile('./index.html', { root: __dirname });
});

// Define socket io events:
io.on('connection', () => {
  console.log("connected");
});
server.listen(3000);
