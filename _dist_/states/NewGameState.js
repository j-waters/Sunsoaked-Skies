import State from "./StateManager.js";
import Ship2 from "../models/Ship.js";
import Helm2 from "../models/rooms/Helm.js";
import Quarters2 from "../models/rooms/Quarters.js";
import Person2 from "../models/Person.js";
import Gunnery2 from "../models/rooms/Gunnery.js";
import Storage2 from "../models/rooms/Storage.js";
import Engine2 from "../models/rooms/Engine.js";
import Empty2 from "../models/rooms/Empty.js";
import World2 from "../models/World.js";
var Point = Phaser.Geom.Point;
var Vector2 = Phaser.Math.Vector2;
import ShipState2 from "./ShipState.js";
export default class NewGameState extends State {
  getScenes() {
  }
  initScenes() {
  }
  start(previousState) {
    let builder = Ship2.builder();
    let r1 = builder.createRootRoom(new Helm2(1, 1, false)).addRoomDown(new Quarters2(1, 2)).addPerson(new Person2()).addPerson(new Person2());
    r1.addRoomRight(new Gunnery2(3, 1)).addPerson(new Person2()).addPerson(new Person2());
    r1.addRoomRight(new Storage2(2, 1), new Vector2(0, 1)).addPerson(new Person2());
    r1.addRoomDown(new Engine2(1, 1)).addPerson(new Person2()).addRoomRight(new Empty2(1, 1));
    this.dataStore.playerShip = builder.build();
    let world = World2.generate();
    this.dataStore.worlds.push(world);
    this.dataStore.playerShip.world = world;
    this.dataStore.playerShip.position = new Vector2(256, 256);
    this.state.start(ShipState2);
  }
  end(nextState) {
  }
}
