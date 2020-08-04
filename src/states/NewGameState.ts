import State from './StateManager';
import Ship from '../models/Ship';
import Helm from '../models/rooms/Helm';
import Quarters from '../models/rooms/Quarters';
import Person from '../models/Person';
import Gunnery from '../models/rooms/Gunnery';
import Storage from '../models/rooms/Storage';
import Engine from '../models/rooms/Engine';
import Empty from '../models/rooms/Empty';
import MapState from './MapState';
import World from '../models/World';
import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;
import ShipState from './ShipState';

export default class NewGameState extends State {
	getScenes() {}
	initScenes() {}
	start(previousState: State) {
		let builder = Ship.builder();

		let r1 = builder
			.createRootRoom(new Helm(1, 1, false)) //
			.addRoomDown(new Quarters(1, 2))
			.addPerson(new Person())
			.addPerson(new Person());

		r1.addRoomRight(new Gunnery(3, 1)).addPerson(new Person()).addPerson(new Person());

		r1.addRoomRight(new Storage(2, 1), new Vector2(0, 1)).addPerson(new Person());
		r1.addRoomDown(new Engine(1, 1)).addPerson(new Person()).addRoomRight(new Empty(1, 1));
		this.dataStore.playerShip = builder.build();

		let world = World.generate();
		this.dataStore.worlds.push(world);
		this.dataStore.playerShip.world = world;
		this.dataStore.playerShip.position = new Vector2(256, 256);

		this.state.start(ShipState);
	}

	end(nextState: State) {}
}