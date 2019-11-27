import Rectangle from "./rectangle.js";
import SkinManager from "../client-objects/skin-manager.js";
export default class Wall extends Rectangle {
  constructor(id, x, y, width, height, skin = "grey", platform=false) {
    super(x, y, width, height);
    this.id = id;
    this.skin = skin;
    this.platform = platform;
  }

  draw(ctx) {
    ctx.fillStyle = SkinManager.getWallSkin(ctx, this.skin, this.x, this.y);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  serialize() {
    let res = {};
    res.id = this.id;
    res.x = this.x;
    res.y = this.y;
    res.width = this.width;
    res.height = this.height;
    res.skin = this.skin;
    res.platform = this.platform;
    return res;
  }
}

