import { SceneBase } from './SceneBase';
import Ship from '../models/Ship';
import Room from '../models/Room';
import { generateHullGraphic, generateShipGraphic } from '../generation/generateShip';
import { createBackground } from '../generation/generateBackground';
import ShipHull from '../sprites/ShipHull';
import Person from '../models/Person';
import Helm from '../models/rooms/Helm';
import Quarters from '../models/rooms/Quarters';
import Gunnery from '../models/rooms/Gunnery';
import Storage from '../models/rooms/Storage';
import Engine from '../models/rooms/Engine';
import Empty from '../models/rooms/Empty';

export class ShipScene extends SceneBase {
	private shipContainer: ShipHull;
	constructor() {
		super('ShipScene');
	}
	public create(): void {
		let bgt = createBackground(this);
		let background = this.add.image(0, 0, bgt);
		background.setOrigin(0, 0);

		let builder = Ship.builder();
		// builder
		// 	.createRootRoom(1, 1, false) //
		// 	.addRoomDown(new Room(1, 1))
		// 	.addRoomRight(new Room(2, 1))
		// 	.addRoomDown(new Room(1, 1))
		// 	.addRoomLeft(new Room(2, 1));

		let r1 = builder
			.createRootRoom(new Helm(1, 1, false)) //
			.addRoomDown(new Quarters(1, 2))
			.addPerson(new Person())
			.addPerson(new Person());

		r1.addRoomRight(new Gunnery(3, 1)).addPerson(new Person()).addPerson(new Person());

		r1.addRoomRight(new Storage(2, 1), [0, 1]).addPerson(new Person());
		r1.addRoomDown(new Engine(1, 1)).addPerson(new Person()).addRoomRight(new Empty(1, 1));
		let ship = builder.build();
		this.shipContainer = new ShipHull(this, ship);
		this.shipContainer.setPosition(this.gameWidth / 2, this.gameHeight / 2);
		this.add.existing(this.shipContainer);
		// image.setDisplaySize(this.gameWidth * 0.8, ((this.gameWidth * 0.8) / image.displayWidth) * image.displayHeight);
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
		this.shipContainer.update(time, delta);
	}
}
