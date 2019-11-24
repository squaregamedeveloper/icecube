import DefaultBackground from "./default-background.js";
import World from '../objects/world.js';
import Controls from '../objects/controls.js';
import SkinManager from "./skin-manager.js";

let baseWidth = 1853;
let baseHeight = 951;
let scale = 1;
let mousePosition = {x: 250, y: 250};
let controls = new Controls(scale);
let socket;
let world;
let room_id;

//Get HTML elements:
let loader = document.getElementById("loader");
let loginSection = document.getElementById('login');
let gameSection = document.getElementById('game');
let scoreBoard = document.getElementById('scoreBoard');
let roomSizeSection = document.getElementById('connected');

let background = document.getElementById('background');
let backgroundManager = new DefaultBackground(background);
backgroundManager.start();

let skinSelector = document.getElementById('skinSelector');
let skinManager = new SkinManager(skinSelector);
skinManager.displaySkins();

let canvas = document.getElementById("canvas");
canvas.setAttribute('width', document.body.clientWidth); //max width
canvas.setAttribute('height', document.body.clientHeight); //max height
let context = canvas.getContext("2d");

document.getElementById("playButton").onclick = () => {
  let playerName = document.getElementById("name").value;
  let skin = skinManager.selectedSkin;

  if (playerName.length < 3){
    document.getElementById("name").style.border = "2px solid red";
    return;
  }

  //Connecting To socket.io
  socket = io.connect(window.location.host, {query: `playerName=${playerName}&skin=${skin}`});

  socket.on("connectedToRoom", (data) => {
    loader.style.display = 'block';
    loginSection.style.display = 'none';
    room_id = data.id;
    roomSizeSection.innerHTML = `${data.numConnected} / ${data.roomSize} <br/> Players connected`;
  });

  socket.on("startGame", (data) => {
    loader.style.display = "none";
    gameSection.style.display = 'block';
    world = new World(data, true);
    window.requestAnimationFrame(loop);
  });

  socket.on('updateState', (data) => {
    world.updateState(data);
  });
};

function handleCanvas() {
  canvas.setAttribute('width', document.body.clientWidth); //max width
  canvas.setAttribute('height', document.body.clientHeight); //max height
  let scaleX = document.body.clientWidth / baseWidth;
  let scaleY = document.body.clientHeight / baseHeight;
  scale = Math.min(scaleX, scaleY);
  context.scale(scale, scale);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScoreBoard(){
  let scoreList = [];
  for(let playerID in world.players){
    scoreList.push({id: playerID,name: world.players[playerID].name, score: world.players[playerID].score});
  }
  scoreList.sort((a, b) => b.score - a.score);
  scoreBoard.innerHTML = `<span>${room_id}</span><br/>`;
  for(let player of scoreList){
    scoreBoard.innerHTML += `<span class="scoreLine" style="color:${world.players[player.id].color}">${player.name} : ${player.score}</span>`;
  }
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
    socket.emit("updateMouse", controls.mousePosition);
  }, mouseRefreshRate);
  // Update server with the mouse position:

  // Update
  world.update();
  updateScoreBoard();

  // Draw
  handleCanvas();
  world.draw(context);

  // Loop
  window.requestAnimationFrame(loop);
}
