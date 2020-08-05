import {generateRoomBackground} from "../../generation/generateRoom.js";
import Room2 from "../../models/Room.js";
var Sprite = Phaser.GameObjects.Sprite;
import dat2 from "../../../web_modules/dat.gui.js";
var Vector2 = Phaser.Math.Vector2;
export default class RoomSprite extends Sprite {
  constructor(parent, roomData, generationSettings) {
    let texture = parent.textures.addCanvas(null, generateRoomBackground(roomData, generationSettings), true);
    super(parent, 0, 0, texture);
    this.setInteractive({useHandCursor: true});
    this.parent = parent;
    this.room = roomData;
    this.generationSettings = generationSettings;
    this.on(Phaser.Input.Events.POINTER_DOWN, (pointer, x, y, event) => {
      this.parent.select(this);
      event.stopPropagation();
      console.log("Clicked:", this);
    });
    if (true) {
      this.debugGui = new dat2.GUI();
      this.debugGui.hide();
    }
  }
  get selected() {
    return this.parent.selected === this;
  }
  select() {
    this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth, 16755200);
    this.highlightBox.setVisible(true);
    this.debugGui.show();
  }
  deselect() {
    this.highlightBox.setVisible(false);
    this.debugGui.hide();
  }
  setupHover() {
    let thickness = this.generationSettings.strokeThickness / 2;
    this.highlightBox = this.parent.add.rectangle(this.x + thickness / 2, this.y + thickness / 2, this.width - thickness, this.height - thickness);
    this.highlightBox.setStrokeStyle(thickness, 16776960);
    this.highlightBox.setVisible(false);
    this.highlightBox.setOrigin(0, 0);
    this.on(Phaser.Input.Events.POINTER_OVER, (event) => {
      this.highlightBox.setStrokeStyle(thickness, 16776960);
      this.highlightBox.setVisible(true);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, (event) => {
      if (this.selected) {
        this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth, 16755200);
      } else {
        this.highlightBox.setVisible(false);
      }
    });
  }
  setPosition(x, y, z, w) {
    super.setPosition(x, y, z + 1, w);
    if (this.highlightBox) {
      this.highlightBox.setPosition(x, y, z, w);
    }
    return this;
  }
  personWorldPosition(roomPosition) {
    let positions = Room2.possiblePositions(this.room.width);
    let divisor = positions * 2;
    let xPos = this.x + this.width / divisor * (roomPosition.x * 2 + 1);
    let yPos = this.y + (roomPosition.y + 1) * (this.height / this.room.height);
    return new Vector2(xPos, yPos);
  }
}
