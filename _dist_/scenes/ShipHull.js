import RoomSprite2 from "../sprites/ship/RoomSprite.js";
import GenerationSettings from "../generation/generationSettings.js";
import PersonSprite2 from "../sprites/ship/PersonSprite.js";
import {SceneBase as SceneBase2} from "./SceneBase.js";
export default class ShipHull extends SceneBase2 {
  constructor() {
    super(...arguments);
    this.roomSprites = [];
    this.personSprites = [];
    this.selected = null;
  }
  create(data) {
    this.ship = data.ship;
    this.generationSettings = new GenerationSettings(2);
    this.background = this.add.image(this.gameWidth / 2, this.gameHeight / 2, this.ship.generateTexture(this, this.generationSettings));
    this.ship.rooms.forEach((room) => {
      this.addRoom(room);
    });
    this.ship.rooms.forEach((room) => {
      this.addPeople(room.people);
    });
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (event) => {
      console.log("deselect");
      this.deselect();
    });
    this.events.on(Phaser.Scenes.Events.WAKE, () => this.wake());
    this.wake();
  }
  wake() {
    this.input.setDefaultCursor(`initial`);
  }
  update(time, delta) {
    this.personSprites.forEach((person) => {
      person.update(time, delta);
    });
  }
  addRoom(room) {
    let roomSprite = new RoomSprite2(this, room, this.generationSettings);
    let xOffset = this.background.width / 2;
    let yOffset = this.background.height / 2;
    roomSprite.setPosition(room.gridPosition.x * this.generationSettings.roomSizeMargin - xOffset + this.generationSettings.margin + this.gameWidth / 2, room.gridPosition.y * this.generationSettings.roomSizeMargin - yOffset + this.generationSettings.margin + this.gameHeight / 2);
    roomSprite.setOrigin(0, 0);
    this.roomSprites.push(roomSprite);
    this.add.existing(roomSprite);
    roomSprite.setupHover();
  }
  addPeople(people) {
    people.forEach((person) => {
      let personSprite = new PersonSprite2(this, person, this.generationSettings);
      this.personSprites.push(personSprite);
      this.add.existing(personSprite);
      personSprite.moveToPosition();
    });
  }
  select(object) {
    if (this.selected instanceof PersonSprite2 && object instanceof RoomSprite2) {
      this.selected.tasks.addMoveTo(object.room);
      return;
    }
    this.deselect();
    this.selected = object;
    this.selected.select();
  }
  deselect() {
    if (this.selected) {
      this.selected.deselect();
      this.selected = null;
    }
  }
  getRoomSprite(room) {
    return this.roomSprites.find((roomSprite) => roomSprite.room == room);
  }
}
