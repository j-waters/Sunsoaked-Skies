import {SceneBase as SceneBase2} from "./SceneBase.js";
import WebFontFile2 from "../loaders/WebFontFile.js";
import NewGameState2 from "../states/NewGameState.js";
export class Preloader extends SceneBase2 {
  constructor() {
    super(Preloader.key);
  }
  preload() {
    this.load.image("menu/hill", "assets/images/menu/hill.png");
    this.load.svg("ui/compass", "assets/images/ui/compass.svg", {width: 512, height: 512});
    this.load.svg("map/ruin", "assets/images/map/ruin.svg", {width: 512, height: 512});
    this.load.svg("map/move-target", "assets/images/map/move-target.svg", {width: 512, height: 512});
    this.load.addFile(new WebFontFile2(this.load, ["Artifika"]));
  }
  create() {
    this.state.start(NewGameState2);
  }
}
Preloader.key = "Preloader";
