export default class SkinManager {

  static get playerSkins() {
    return {
      "walker": {"body": "#FFFFFF", "eyes": "#51DBFF"},
      "werewolf": {"body": "#8B4513", "eyes": "#FF0000"},
      "trump": {"body": "#ffa200", "eyes": "#95b7c7"},
      "swamp": {"body": "#348a21", "eyes": "#4f340a"},
      "ghost": {"body": "#d4d4d4", "eyes": "#a8a8a8"},
      "ninja": {"body": "#000000", "eyes": "#FF0000"},
      "egg": {"body": "#FFFFFF", "eyes": "#ffee00"},
      "wizard": {"body": "#80119c", "eyes": "#2fff00"},
      "pig": {"body": "#ffaad4", "eyes": "#000000"},
      "aqua": {"body": "#00ffff", "eyes": "#0000ff"},
      "toxic": {"body": "#00ff00", "eyes": "#aaffaa"},
    };
  }

  static getWallSkin(ctx, name, x, y) {
    if(name === "grey") return "#2c2c2c";
    if(name === "ice-platform"){
      let grd = ctx.createLinearGradient(x, y, x, y + 50);
      grd.addColorStop(0, 'rgba(255, 255, 255, 1.000)');
      grd.addColorStop(0.15, 'rgba(255, 255, 255, 1.000)');
      grd.addColorStop(0.16, 'rgba(44, 44, 44, 1.000)');
      grd.addColorStop(1, 'rgba(44, 44, 44, 1.000)');
      return grd;
    }
  }

  constructor(selector) {
    this.selector = selector;
    this.skinList = [];
    for (let skin in SkinManager.playerSkins) {
      this.skinList.push(skin);
    }

    this.selectedSkin = Math.floor(Math.random() * this.skinList.length);
    this.attachListeners();
  }

  selectPlayerSkin() {
    return this.skinList[this.selectedSkin];
  };

  displayPlayerSkins() {
    this.selector.querySelector("#selectedSkin").innerHTML = "";
    for (let i = this.selectedSkin - 2; i <= this.selectedSkin + 2; i++) {
      let index = (i + this.skinList.length) % this.skinList.length;
      let skin = this.skinList[index];
      let eyeColor = SkinManager.playerSkins[skin].eyes;
      let bodyColor = SkinManager.playerSkins[skin].body;
      this.selector.querySelector("#selectedSkin").innerHTML += `
      <a class="skin ${(index === this.selectedSkin) ? 'currentSkin' : ''}" data-index="${index}" data-name="${skin}" style="background: ${bodyColor}">
          <div class="eyes">
              <div style="background: ${eyeColor}"></div>
              <div style="background: ${eyeColor}"></div>
          </div>
          ${(index === this.selectedSkin) ? `<h3>${skin}</h3>` : ''}
      </a>
       `;
    }
    Array.from(document.getElementsByClassName('skin')).forEach((element) => {
      element.addEventListener('click', (event) => {
        this.selectedSkin = parseInt(event.target.dataset.index);
        this.displayPlayerSkins();
      });
    });
  };

  attachListeners() {
    this.selector.querySelector(".left").addEventListener('click', () => {
      this.selectedSkin = (this.selectedSkin + this.skinList.length - 1) % this.skinList.length;
      this.displayPlayerSkins()
    });
    this.selector.querySelector(".right").addEventListener('click', () => {
      this.selectedSkin = (this.selectedSkin + 1) % this.skinList.length;
      this.displayPlayerSkins()
    });
  }
}
