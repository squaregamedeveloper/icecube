export default class SkinManager {

  static get skins() {
    return {
      "walker": {"body": "#FFFFFF", "eyes": "#51DBFF"},
      "werewolf": {"body": "#8B4513", "eyes": "#FF0000"},
      "trump": {"body": "#ffa200", "eyes": "#95b7c7"},
      "swamp": {"body": "#348a21", "eyes": "#4f340a"},
      "ghost": {"body": "#d4d4d4", "eyes": "#a8a8a8"},
      "ninja": {"body": "#000000", "eyes": "#FF0000"},
      "egg": {"body": "#FFFFFF", "eyes": "#ffee00"},
      "wizard": {"body": "#80119c", "eyes": "#2fff00"},
    };
  }

  constructor(selector) {
    this.selector = selector;
    this.skinList = [];
    for (let skin in SkinManager.skins) {
      this.skinList.push(skin);
    }

    this.selectedSkin = Math.floor(Math.random() * this.skinList.length);
    this.attachListeners();
  }

  selectSkin() {
    return this.skinList[this.selectedSkin];
  };

  displaySkin() {
    this.selector.querySelector("#selectedSkin").innerHTML = "";
    let skin = this.skinList[this.selectedSkin];
    let eyeColor = SkinManager.skins[skin].eyes;
    let bodyColor = SkinManager.skins[skin].body;
    this.selector.querySelector("#selectedSkin").innerHTML += `
      <a class="skin" data-name="${skin}" style="background: ${bodyColor}">
          <div class="eyes">
              <div style="background: ${eyeColor}"></div>
              <div style="background: ${eyeColor}"></div>
          </div>
          <h3>${skin}</h3>
      </a>
    `;
  };

  attachListeners() {
    this.selector.querySelector(".left").addEventListener('click', () => {
      this.selectedSkin = (this.selectedSkin + this.skinList.length - 1) % this.skinList.length;
      this.displaySkin()
    });
    this.selector.querySelector(".right").addEventListener('click', () => {
      this.selectedSkin = (this.selectedSkin + 1) % this.skinList.length;
      this.displaySkin()
    });
  }
}
