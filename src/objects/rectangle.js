export default class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(rect) {
    let pos = {
      "x": this.x,
      "y": this.y,
      "width": this.width,
      "height": this.height,
    };

    //Check for intersection:
    if (this.x < rect.x + rect.width && rect.x < this.x + this.width && this.y < rect.y + rect.height && rect.y < this.y + this.height) {
      if (this.x > rect.x) pos["left"] = true;
      if (this.x + this.width < rect.x + rect.width) pos["right"] = true;
      if (this.y > rect.y) pos["top"] = true;
      if (this.y + this.height < rect.y + rect.height) pos["bottom"] = true;
      return pos;
    } else return null;
  };
}
