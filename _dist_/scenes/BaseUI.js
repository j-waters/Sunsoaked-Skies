import {SceneBase as SceneBase2} from "./SceneBase.js";
export default class BaseUI extends SceneBase2 {
  create() {
    this.createLargeButton();
  }
  createLargeButton() {
    let bg = this.add.rectangle(this.gameWidth + 2.5, this.gameHeight + 2.5, 200, 200);
    bg.setOrigin(1, 1);
    bg.setStrokeStyle(5, 7031345);
    bg.setFillStyle(15511679);
    bg.setInteractive({
      useHandCursor: true
    });
    let compass = this.add.image(this.gameWidth - 25, this.gameHeight - 25, this.largeButton.texture);
    compass.setOrigin(1, 1);
    compass.setDisplaySize(150, 150);
    compass.setTint(16109122);
    bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.largeButton.action();
    });
  }
}
