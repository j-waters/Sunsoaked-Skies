import { SceneBase } from "./SceneBase";

export class Preloader extends SceneBase {
  constructor() {
    super("Preloader");
  }
  public create(): void {
    console.log("Preloader");

    this.scene.start("Menu");
  }
}
