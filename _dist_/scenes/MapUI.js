import BaseUI2 from "./BaseUI.js";
import ShipState2 from "../states/ShipState.js";
export default class MapUI extends BaseUI2 {
  constructor() {
    super(...arguments);
    this.largeButton = {
      texture: "ui/compass",
      action: () => {
        this.state.start(ShipState2);
      }
    };
  }
  create() {
    super.create();
  }
}
