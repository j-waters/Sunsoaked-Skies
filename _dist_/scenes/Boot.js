import {SceneBase as SceneBase2} from "./SceneBase.js";
import {Preloader as Preloader2} from "./Preloader.js";
export class Boot extends SceneBase2 {
  constructor() {
    super("Boot");
  }
  create() {
    this.scene.start(Preloader2.name);
  }
}
