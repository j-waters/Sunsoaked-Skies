import { SceneBase } from "./SceneBase";

export class Menu extends SceneBase {
  constructor() {
    super("Menu");
  }
  public create(): void {
    console.log("Menu");

    // bacground color
    this.cameras.main.backgroundColor = Phaser.Display.Color.ValueToColor(
      0x808080
    );

    // focus on 0, 0
    this.setView();

    // red circle
    let graphics = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(0, 0, 50);
    graphics.setInteractive(
      new Phaser.Geom.Circle(0, 0, 50),
      Phaser.Geom.Circle.Contains
    );
    graphics.on("pointerdown", () => {
      console.log("start");
      this.scene.start("GameScene");
    });
  }
}
