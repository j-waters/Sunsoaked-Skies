import {generateGrid, generateHullGraphic, generateTopDownShipGraphic} from "../generation/generateShip.js";
var Vector2 = Phaser.Math.Vector2;
import {POSITIVE_ZERO} from "../sprites/map/MapShipSprite.js";
var Scene = Phaser.Scene;
export default class Ship {
  constructor(rootRoom) {
    this.turningModifier = 100;
    this.speed = 5;
    this.acceleration = 0.01;
    this.rootRoom = rootRoom;
    this.velocity = new Vector2(0, POSITIVE_ZERO);
  }
  get decelerationDistance() {
    return this.velocity.length() / (2 * this.acceleration);
  }
  generateTexture(scene, gs) {
    if (scene.textures.exists("ship_hull")) {
      return scene.textures.get("ship_hull");
    }
    let shipCanvas = generateHullGraphic(this, gs);
    return scene.textures.addCanvas("ship_hull", shipCanvas);
  }
  generateTopDownTexture(scene) {
    if (scene.textures.exists("ship_top_down")) {
      return scene.textures.get("ship_top_down");
    }
    let shipCanvas = generateTopDownShipGraphic(this);
    return scene.textures.addCanvas("ship_top_down", shipCanvas);
  }
  static builder() {
    return new ShipBuilder();
  }
  get roomGrid() {
    return generateGrid(this.rootRoom);
  }
  get people() {
    return this.rooms.flatMap((room) => room.people);
  }
  get rooms() {
    let rooms = [];
    this.roomGrid.forEach((row, y) => {
      row.forEach((room, x) => {
        if (room && !rooms.includes(room)) {
          room.setGridPosition(x, y);
          rooms.push(room);
        }
      });
    });
    return rooms;
  }
}
class ShipBuilder {
  createRootRoom(room) {
    this.rootRoom = room;
    return this.rootRoom;
  }
  build() {
    let ship = new Ship(this.rootRoom);
    ship.rootRoom.setShip(ship);
    return ship;
  }
}
