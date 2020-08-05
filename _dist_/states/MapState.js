import State from "./StateManager.js";
import WorldMap2 from "../scenes/WorldMap.js";
import MapUI2 from "../scenes/MapUI.js";
export default class MapState extends State {
  start(previousState) {
    this.scene.run("map", {world: this.dataStore.playerShip.world});
    this.scene.run("map_ui");
    this.getScenes();
  }
  end(nextState) {
    this.scene.sleep("map");
    this.scene.sleep("map_ui");
  }
  initScenes() {
    this.mapScene = this.scene.add("map", WorldMap2);
    this.uiScene = this.scene.add("map_ui", MapUI2);
  }
  getScenes() {
    this.mapScene = this.scene.getScene("map");
    this.uiScene = this.scene.getScene("map_ui");
  }
}
