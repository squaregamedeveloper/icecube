export default class Controls {
  leftKeyCodes = [65, 97, 37];
  rightKeyCodes = [68, 100, 39];
  upKeyCodes = [87, 119, 38];
  downKeyCodes = [83, 115, 40];

  constructor() {
    [this.left, this.down, this.up, this.right, this.shoot] = Array(5).fill(false);
  }

  getControls = () => ({left: this.left, down: this.down, up: this.up, right: this.right, shoot: this.shoot})

  update = (e, param) => {
    if (this.rightKeyCodes.includes(e.keyCode)) this.right = param; // D
    else if (this.downKeyCodes.includes(e.keyCode)) this.down = param; // S
    else if (this.leftKeyCodes.includes(e.keyCode)) this.left = param; // A
    else if (this.upKeyCodes.includes(e.keyCode)) this.up = param; // W
    else if (e.click) this.shoot = param;
  };

  keyDown = (e) => this.update(e, true);
  keyUp = (e) => this.update(e, false);
  mouseDown = () => this.update({"click": true}, true);
  mouseUp = () => this.update({"click": true}, false);
}
