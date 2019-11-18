//document.addEventListener("DOMContentLoaded", function(event) {
import World from './world.js';
import Controls from './controls.js';
import {generateID, createGradient} from './utils.js'

let c = document.getElementById("game");
c.setAttribute('width', document.body.clientWidth); //max width
c.setAttribute('height', document.body.clientHeight); //max height
let ctx = c.getContext("2d");
let baseWidth = 1853;
let baseHeight = 951;
let scale = 1;
// ctx.globalAlpha = 0.1;
let mousePosition = {x: 250, y: 250};
let controls = new Controls();
let socket;
document.addEventListener("mousemove", (e) => {
  mousePosition = {x: e.clientX / scale, y: e.clientY / scale};
});
document.addEventListener("mousedown", controls.mouseDown);
document.addEventListener("mouseup", controls.mouseUp);
document.addEventListener("keyup", controls.keyUp);
document.addEventListener("keydown", controls.keyDown);
document.getElementById("playButton").onclick = () => {
  let playerName = document.getElementById("name").value;
  let color = document.getElementById("color").value;

  //Connecting To socket.io
  socket = io.connect(window.location.host, {query: `playerName=${playerName}&color=${color}`});

  socket.on("connectToRoom", (data) => {
    c.style.display = 'block';
    document.getElementById('menu').style.display='none';
    //alert(JSON.stringify(data));
    player1_id = socket.id;
    world = new World(data);
    window.requestAnimationFrame(loop);
  });

  socket.on('updateState', (data) => {
    // console.table([data['players'][player1_id].mousePosition, mousePosition]);
    world.updateState(data);
  });
};

let player1_id = generateID();
let player2_id = generateID();
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
      color: createGradient(ctx, 0, baseHeight - 50, 0, baseHeight)
    },
    "platform": {
      x: 150,
      y: baseHeight - 300,
      width: baseWidth / 4,
      height: 50,
      color: createGradient(ctx, 150, baseHeight - 300, 150, baseHeight - 250)
    },
  },
};

//let world = new World(initialState);
let world;

function handleCanvas() {
  c.setAttribute('width', document.body.clientWidth); //max width
  c.setAttribute('height', document.body.clientHeight); //max height
  let scaleX = document.body.clientWidth / baseWidth;
  let scaleY = document.body.clientHeight / baseHeight;
  scale = Math.min(scaleX, scaleY);
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, c.width, c.height);
}


let old_controls = {};
let mouseRefreshRate = 1000;

function loop(a) {
  // Update server with the controls:
  let new_controls = controls.serialize();
  if (JSON.stringify(old_controls) !== JSON.stringify(new_controls)) {
    socket.emit("updateControls", new_controls);
    old_controls = new_controls;
  }
  setTimeout(() => {
    socket.emit("updateMouse", mousePosition);
  }, mouseRefreshRate);
  // Update server with the mouse position:

  world.updatePlayerControls(player1_id, controls);
  world.updatePlayerMouse(player1_id, mousePosition);
  // Update
  world.update();

  // Draw
  handleCanvas();
  world.draw(ctx);

  // Loop
  window.requestAnimationFrame(loop);
  //setTimeout(loop, 500);

  // Debug
  ctx.font = "30px Arial";
  ctx.fillStyle = 'black';
  ctx.fillText(`${JSON.stringify(mousePosition)}`, 20, 30)
}
