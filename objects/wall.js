export default class Wall {
  constructor(id, x, y, width, height, color = "blue") {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  intersects = (x, y, width, height) => {
    let pos = {
      "x": this.x,
      "y": this.y,
      "width": this.width,
      "height": this.height,
    };

    //Check for intersection:
    if (this.x < x + width && x < this.x + this.width && this.y < y + height && y < this.y + this.height) {
      if (this.x > x) pos["left"] = true;
      if (this.x + this.width < x + width) pos["right"] = true;
      if (this.y > y) pos["top"] = true;
      if (this.y + this.height < y + height) pos["bottom"] = true;
      return pos;
    } else return null;
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
