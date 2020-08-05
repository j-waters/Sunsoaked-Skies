import {SceneBase as SceneBase2} from "./SceneBase.js";
import {generateWorldTexture, worldTypes} from "../generation/generateWorld.js";
import dat2 from "../../web_modules/dat.gui.js";
export default class WorldMapTester extends SceneBase2 {
  create(data) {
    console.log("hello");
    this.world = data.world;
    this.map = this.add.image(0, 0, generateWorldTexture(this, this.world, 512));
    this.map.setOrigin(0, 0);
    this.map.setDisplaySize(this.gameHeight, this.gameHeight);
    this.debug = new dat2.GUI();
    this.debug.add(worldTypes[this.world.worldType], "zoom", 30, 200).onFinishChange(() => this.reload());
    this.debug.add(worldTypes[this.world.worldType], "threshold", 0, 1).onFinishChange(() => this.reload());
    this.debug.add(worldTypes[this.world.worldType], "exp", 0, 5).onFinishChange(() => this.reload());
    this.debug.add(worldTypes[this.world.worldType], "gradientZoom", 0, 5).onFinishChange(() => this.reload());
    this.debug.add(worldTypes[this.world.worldType], "elev2proportion", 0, 1).onFinishChange(() => this.reload());
    this.debug.add(worldTypes[this.world.worldType], "elevationMod", 0, 2).onFinishChange(() => this.reload());
    this.debug.add({
      reSeed: () => this.world.seed = Math.random().toString()
    }, "reSeed").onFinishChange(() => this.reload());
  }
  reload() {
    console.log("refreshing...");
    this.map.setTexture(generateWorldTexture(this, this.world, 512, this.gs));
    console.log("done");
  }
}
