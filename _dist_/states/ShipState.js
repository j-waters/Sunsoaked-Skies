import State from "./StateManager.js";
import {Background as Background2} from "../scenes/Background.js";
import ShipHull2 from "../scenes/ShipHull.js";
import ShipUI2 from "../scenes/ShipUI.js";
import MapState2 from "./MapState.js";
export default class ShipState extends State {
  initScenes() {
    console.log("init");
    this.background = this.scene.add("background", Background2);
    this.shipScene = this.scene.add("ship", ShipHull2);
    this.uiScene = this.scene.add("ship_ui", ShipUI2);
  }
  getScenes() {
    this.background = this.scene.getScene("background");
    this.shipScene = this.scene.getScene("ship");
    this.uiScene = this.scene.getScene("ship_ui");
  }
  start(previousState) {
    this.scene.run("background");
    this.scene.run("ship", {ship: this.dataStore.playerShip});
    this.scene.run("ship_ui");
    this.getScenes();
    if (!(previousState instanceof MapState2)) {
      this.panIn();
    }
    this.shipBob();
  }
  panIn() {
    const duration = 2e3;
    this.shipScene.cameras.main.setZoom(0.5);
    this.shipScene.tweens.add({
      targets: this.shipScene.cameras.main,
      x: {
        from: -this.shipScene.gameWidth,
        to: 0,
        ease: "Quad.easeInOut"
      },
      zoom: {
        from: 0.5,
        to: 0.8,
        ease: "Quart.easeIn"
      },
      duration
    });
    this.uiScene.cameras.main.setZoom(1.2);
    this.uiScene.cameras.main.zoomTo(1, 350, "Quad.easeOut");
    this.uiScene.tweens.add({
      targets: this.uiScene.cameras.main,
      alpha: {
        from: 0,
        to: 1
      },
      duration,
      ease: "Quad.easeOut"
    });
  }
  shipBob() {
    this.uiScene.tweens.add({
      targets: this.shipScene.cameras.main,
      y: "+=15",
      duration: 8e3,
      repeat: -1,
      yoyo: true,
      ease: "Cubic.easeInOut"
    });
  }
  end(newState) {
    console.log("end");
    this.scene.sleep("ship");
    this.scene.sleep("ship_ui");
    this.scene.sleep("background");
  }
}
