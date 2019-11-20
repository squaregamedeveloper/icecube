import Rectangle from "./rectangle.js";
export default class Wall extends Rectangle {
  constructor(id, x, y, width, height, color = "#071739") {
    super(x, y, width, height);
    this.id = id;
    this.color = color;
  }

  draw = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  serialize = () => {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.width = this.width;
    res.height = this.height;
    res.color = this.color;
    return res;
  }
}

