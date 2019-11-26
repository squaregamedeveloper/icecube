export default class Controls {
  constructor() {
    this.leftKeyCodes = [65, 97, 37];
    this.rightKeyCodes = [68, 100, 39];
    this.upKeyCodes = [87, 119, 38];
    this.downKeyCodes = [83, 115, 40];
    this.mousePosition = {x: 250, y: 250};

    [this.left, this.down, this.up, this.right, this.shoot] = Array(5).fill(false);

    document.addEventListener("mousemove", (event) => { this.updateMousePos(event)});
    document.addEventListener("mousedown", (event) => this.update({"click": true}, true));
    document.addEventListener("mouseup", (event) => this.update({"click": true}, false));
    document.addEventListener("keyup", (event) => this.update(event, false));
    document.addEventListener("keydown",(event) => this.update(event, true));
  }

  getControls = () => ({left: this.left, down: this.down, up: this.up, right: this.right, shoot: this.shoot});

  update = (e, param) => {
    if (this.rightKeyCodes.includes(e.keyCode)) this.right = param; // D
    else if (this.downKeyCodes.includes(e.keyCode)) this.down = param; // S
    else if (this.leftKeyCodes.includes(e.keyCode)) this.left = param; // A
    else if (this.upKeyCodes.includes(e.keyCode)) this.up = param; // W
    else if (e.click) this.shoot = param;
  };

  updateMousePos(event){
    let scaleX = document.body.clientWidth / 1853; //TODO: change
    let scaleY = document.body.clientHeight / 951;
    let finalScale = Math.min(scaleX, scaleY);
    this.mousePosition = {x: event.clientX / finalScale, y: event.clientY / finalScale};
  }

  keyDown = (e) => this.update(e, true);
  keyUp = (e) => this.update(e, false);
  mouseDown = () => this.update({"click": true}, true);
  mouseUp = () => this.update({"click": true}, false);

  serialize = () => {
    let res = {};
    res.right = this.right;
    res.down = this.down;
    res.left = this.left;
    res.up = this.up;
    res.shoot = this.shoot;
    return res;
  }
}
