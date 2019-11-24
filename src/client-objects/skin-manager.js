export default class SkinManager{


  constructor(selector){
    this.selector = selector;
  }

  selectSkin(skin) {
    this.selectedSkin = skin;
    this.hideSkinSelector();
  };

  hideSkinSelector()  {this.selector.style.display = "none";}
  showSkinSelector()  {this.selector.style.display = "flex";}

  displaySkins() {
    this.selector.innerHTML = "";
    for(let skin in SkinManager.skins){
      let eyeColor = SkinManager.skins[skin].eyes;
      let bodyColor = SkinManager.skins[skin].body;
      this.selector.innerHTML += `
        <a class="skin" data-name="${skin}" style="background: ${bodyColor}">
            <div class="eyes">
                <div style="background: ${eyeColor}"></div>
                <div style="background: ${eyeColor}"></div>
            </div>
            <h3>${skin}</h3>
        </a>
      `;
    }

    this.attachListeners();
  };

  attachListeners() {
    let skinElements = document.getElementsByClassName('skin');
    for (let skinElement of skinElements) {
      skinElement.addEventListener('click', ()=>(this.selectSkin(skinElement.dataset['name'])));
    }
  }
}

SkinManager.skins = {
  "walker": {"body": "#FFFFFF", "eyes": "#51DBFF"},
  "werewolf": {"body": "#8B4513", "eyes": "#FF0000"},
  "trump": {"body": "#ffa200", "eyes": "#95b7c7"},
  "swamp": {"body": "#348a21", "eyes": "#4f340a"},
  "ghost": {"body": "#d4d4d4", "eyes": "#a8a8a8"},
  "ninja": {"body": "#000000", "eyes": "#FF0000"},
  "egg": {"body": "#FFFFFF", "eyes": "#ffee00"},
  "wizard": {"body": "#80119c", "eyes": "#402600"},
};
