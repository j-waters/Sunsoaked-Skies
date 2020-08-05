import BaseUI2 from "./BaseUI.js";
import MapState2 from "../states/MapState.js";
export default class ShipUI extends BaseUI2 {
  constructor() {
    super(...arguments);
    this.largeButton = {
      texture: "ui/compass",
      action: () => {
        this.state.start(MapState2);
      }
    };
  }
  create() {
    super.create();
  }
}
