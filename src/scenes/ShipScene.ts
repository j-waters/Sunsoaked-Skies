import { SceneBase } from "./SceneBase";
import Ship from "../models/Ship";
import Room from "../models/Room";
import { generateHullGraphic, generateShipGraphic } from "../procedural/generateShip";
import { createBackground } from "../procedural/generateBackground";
import ShipHull from "../sprites/ShipHull";

export class ShipScene extends SceneBase {
	constructor() {
		super("ShipScene");
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

		builder
			.createRootRoom(1, 1, false) //
			.addRoomDown(new Room(1, 1))
			.addRoomRight(new Room(3, 1))
			.addRoomDown(new Room(1, 1), 1)
			.addRoomLeft(new Room(2, 1));
		let ship = builder.build();
		let shipContainer = new ShipHull(this, ship);
		shipContainer.setPosition(this.gameWidth / 2, this.gameHeight / 2);
		this.add.existing(shipContainer);
		// image.setDisplaySize(this.gameWidth * 0.8, ((this.gameWidth * 0.8) / image.displayWidth) * image.displayHeight);
	}
}
