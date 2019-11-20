import SnowFlake from "./snow-flake.js";

export default class DefaultBackground {
  constructor(canvas){
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.snow = [];
    this.flakes = 100;
    for(let i = 0; i < this.flakes; i++){
      this.snow.push(new SnowFlake());
    }
  }

  draw = () =>{
    this.context.fillStyle = "#80DDEC";
    this.context.fillRect(0, 0, this.width, this.height);

    // First mountain layer
    this.context.fillStyle = "#51DBFF";
    this.context.beginPath();
    this.context.moveTo(-300, this.height);
    this.context.lineTo(-300, this.height / 2.5);
    this.context.lineTo(this.width / 12, this.height / 5.5);
    this.context.lineTo(this.width / 3, this.height / 3);
    this.context.lineTo(this.width / 2.2, this.height / 5);
    this.context.lineTo(this.width / 1.5, this.height / 3);
    this.context.lineTo(this.width / 1.1, this.height / 7);
    this.context.lineTo(this.width + 300, this.height / 3);
    this.context.lineTo(this.width + 300, this.height);
    this.context.fill();

    // Second mountain layer
    this.context.fillStyle = "#26C5FF";
    this.context.beginPath();
    this.context.moveTo(-300, this.height);
    this.context.lineTo(-300, this.height / 1.7);
    this.context.lineTo(this.width / 3, this.height / 4);
    this.context.lineTo(this.width / 2, this.height / 2);
    this.context.lineTo(this.width / 1.5, this.height / 4);
    this.context.lineTo(this.width / 1.3, this.height / 3.6);
    this.context.lineTo(this.width / 1.2, this.height / 6);
    this.context.lineTo(this.width + 300, this.height / 1.5);
    this.context.lineTo(this.width + 300, this.height);
    this.context.fill();

    // Third mountain layer
    this.context.fillStyle = "#46B5ED";
    this.context.beginPath();
    this.context.moveTo(-300, this.height);
    this.context.lineTo(-200, this.height / 1.6);
    this.context.lineTo(100, this.height / 2);
    this.context.lineTo(this.width / 6, this.height / 1.8);
    this.context.lineTo(this.width / 4, this.height / 1.9);
    this.context.lineTo(this.width / 3, this.height / 1.6);
    this.context.lineTo(this.width / 2.3, this.height / 1.7);
    this.context.lineTo(this.width / 2, this.height / 2.2);
    this.context.lineTo(this.width / 1.5, this.height / 2.1);
    this.context.lineTo(this.width / 1.1, this.height / 1.7);
    this.context.lineTo(this.width + 300, this.height / 2);
    this.context.lineTo(this.width + 300, this.height);
    this.context.fill();

    this.drawSnow();

  };

  drawSnow = () => {
    for(let i = 0; i < this.flakes; i++){
      this.snow[i].update();
      this.snow[i].draw(this.context);
    }
  };

  loop = () => {
    this.draw();
    window.requestAnimationFrame(this.loop);
  };

  start = () => window.requestAnimationFrame(this.loop);

}
