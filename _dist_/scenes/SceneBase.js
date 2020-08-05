import {StateManager as StateManager2} from "../states/StateManager.js";
import DataStore2 from "../DataStore.js";
export class SceneBase extends Phaser.Scene {
  constructor(config) {
    super(config);
    this.state = StateManager2.create();
  }
  get gameWidth() {
    return this.scale.width;
  }
  get gameHeight() {
    return this.scale.height;
  }
  setView() {
    this.cameras.main.centerOn(0, 0);
  }
  get dataStore() {
    return DataStore2.create();
  }
}
