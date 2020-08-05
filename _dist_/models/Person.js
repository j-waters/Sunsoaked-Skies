var Point = Phaser.Geom.Point;
var Vector2 = Phaser.Math.Vector2;
import {TaskManager} from "./Task.js";
export default class Person {
  constructor() {
    this.tasks = new TaskManager(this);
  }
  setRoom(room, position) {
    if (this.room) {
      this.room.removePerson(this);
    }
    room.addPerson(this, position);
  }
}
