import DefaultBackground from "./default-background.js";
import World from '../objects/world.js';
import Controls from '../objects/controls.js';
import SkinManager from "./skin-manager.js";

let baseWidth = 1853;
let baseHeight = 951;
let scale = 1;
let controls = new Controls(scale);
let room_id;

class Client{
  constructor(){
    this.socket = null;
    this.world = null;
    this.old_controls = {};
    this.mouseRefreshRate = 1000;
  }

  play(){
    let playerName = document.getElementById("name").value;
    let skin = skinManager.selectPlayerSkin();

    if (playerName.length < 3){
      document.getElementById("name").style.border = "2px solid red";
      return;
    }

    //Connecting To this.socket.io
    this.socket = io.connect(window.location.host, {query: `playerName=${playerName}&skin=${skin}`});

    this.socket.on("connectedToRoom", (data) => {
      loader.style.display = 'block';
      loginSection.style.display = 'none';
      room_id = data.id;
      roomSizeSection.innerHTML = `${data.numConnected} / ${data.roomSize} <br/> Players connected`;
    });

    this.socket.on("startGame", (data) => {
      loader.style.display = "none";
      gameSection.style.display = 'block';
      this.world = new World(data, true);
      window.requestAnimationFrame(() => this.loop());
    });

    this.socket.on('updateState', (data) => {
      this.world.updateState(data);
    });

  }

  updateScoreBoard(){
    let scoreList = [];
    for(let playerID in this.world.players){
      scoreList.push({id: playerID,name: this.world.players[playerID].name, score: this.world.players[playerID].score});
    }
    scoreList.sort((a, b) => b.score - a.score);
    scoreBoard.innerHTML = `<span>${room_id}</span><br/>`;
    for(let player of scoreList){
      scoreBoard.innerHTML += `<span class="scoreLine">${player.name} : ${player.score}</span>`;
    }
  }

  handleCanvas() {
    canvas.setAttribute('width', document.body.clientWidth); //max width
    canvas.setAttribute('height', document.body.clientHeight); //max height
    let scaleX = document.body.clientWidth / baseWidth;
    let scaleY = document.body.clientHeight / baseHeight;
    scale = Math.min(scaleX, scaleY);
    context.scale(scale, scale);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  loop(a) {
    // Update server with the controls:
    let new_controls = controls.serialize();
    if (JSON.stringify(this.old_controls) !== JSON.stringify(new_controls)) {
      this.socket.emit("updateControls", new_controls);
      this.old_controls = new_controls;
    }
    setTimeout(() => this.socket.emit("updateMouse", controls.mousePosition), this.mouseRefreshRate);
    // Update server with the mouse position:

    // Update
    //this.world.updatePlayerControls(this.socket.id, new_controls);
    this.world.update();
    this.updateScoreBoard();

    // Draw
    this.handleCanvas();
    this.world.draw(context);

    // Loop
    window.requestAnimationFrame(() => this.loop());
  }
}

//Get HTML elements:
let loader = document.getElementById("loader");
let loginSection = document.getElementById('login');
let gameSection = document.getElementById('game');
let scoreBoard = document.getElementById('scoreBoard');
let roomSizeSection = document.getElementById('connected');

let background = document.getElementById('background');
let backgroundManager = new DefaultBackground(background);
backgroundManager.start();

let skinSelector = document.getElementById('skinSlider');
let skinManager = new SkinManager(skinSelector);
skinManager.displayPlayerSkins();

let canvas = document.getElementById("canvas");
canvas.setAttribute('width', document.body.clientWidth); //max width
canvas.setAttribute('height', document.body.clientHeight); //max height
let context = canvas.getContext("2d");

let client = new Client();
document.getElementById("playButton").onclick = () => client.play();
