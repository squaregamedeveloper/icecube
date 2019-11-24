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

  draw = () => {
    let stepY = this.height / 24;
    let stepX = this.width / 24;

    this.context.fillStyle = "#80DDEC";
    this.context.fillRect(0, 0, this.width, this.height);

    // First mountain layer
    this.context.fillStyle = "#51DBFF";
    this.context.beginPath();
    this.context.moveTo(-300, stepY * 24);
    this.context.lineTo(-300, stepY * 12);
    this.context.lineTo(stepX * 2, stepY * 4);
    this.context.lineTo(stepX * 7, stepY * 8);
    this.context.lineTo(stepX * 11, stepY * 5);
    this.context.lineTo(stepX * 15, stepY * 9);
    this.context.lineTo(stepX * 22, stepY * 3);
    this.context.lineTo(stepX * 24 + 300, stepY * 12);
    this.context.lineTo(stepX * 24 + 300, stepY * 24);
    this.context.fill();

    // Second mountain layer
    this.context.fillStyle = "#26C5FF";
    this.context.beginPath();
    this.context.moveTo(-300, stepY * 24);
    this.context.lineTo(-300, stepY * 14);
    this.context.lineTo(stepX * 6, stepY * 6);
    this.context.lineTo(stepX * 13, stepY * 12);
    this.context.lineTo(stepX * 16, stepY * 7);
    this.context.lineTo(stepX * 18, stepY * 7);
    this.context.lineTo(stepX * 20, stepY * 4);
    this.context.lineTo(stepX * 24 + 300, stepY * 12);
    this.context.lineTo(stepX * 24 + 300, stepY * 24);
    this.context.fill();

    // Third mountain layer
    this.context.fillStyle = "#46B5ED";
    this.context.beginPath();
    this.context.moveTo(-300, stepY * 24);
    this.context.lineTo(-200, stepY * 16);
    this.context.lineTo(100, stepY * 12);
    this.context.lineTo(stepX * 4, stepY * 14);
    this.context.lineTo(stepX * 6, stepY * 13);
    this.context.lineTo(stepX * 8, stepY * 15);
    this.context.lineTo(stepX * 10, stepY * 12);
    this.context.lineTo(stepX * 11, stepY * 13);
    this.context.lineTo(stepX * 13, stepY * 10);
    this.context.lineTo(stepX * 22, stepY * 15);
    this.context.lineTo(stepX * 24 + 300, stepY * 12);
    this.context.lineTo(stepX * 24 + 300, stepY * 24);
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
