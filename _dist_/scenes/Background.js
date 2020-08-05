import {SceneBase as SceneBase2} from "./SceneBase.js";
var construct = Reflect.construct;
export class Background extends SceneBase2 {
  constructor() {
    super("background");
  }
  preload() {
  }
  create() {
    let background = this.add.image(0, 0, this.generateTexture());
    background.setOrigin(0, 0);
  }
  update() {
  }
  generateTexture() {
    if (this.textures.exists("gradient_background")) {
      return this.textures.get("gradient_background");
    }
    let texture = this.textures.createCanvas("gradient_background", this.gameWidth, this.gameHeight);
    let context = texture.getContext();
    let grd = context.createLinearGradient(0, 0, 0, this.gameHeight);
    grd.addColorStop(0, "#DEB2FF");
    grd.addColorStop(0.5, "#FFB2BF");
    grd.addColorStop(1, "#FFE9B2");
    context.fillStyle = grd;
    context.fillRect(0, 0, this.gameWidth, this.gameHeight);
    texture.refresh();
    return texture;
  }
}
