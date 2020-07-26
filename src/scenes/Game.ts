import { SceneBase } from './SceneBase';
import Ship from '../models/Ship';
import Room from '../models/Room';
import { generateGrid, generateMenuShip, generateShipGraphic } from '../generation/generateShip';

export class GameScene extends SceneBase {
	constructor() {
		super('GameScene');
	}

	preload() {}

	create() {
		// let builder = Ship.builder();
		// builder
		// 	.createRootRoom(new Room(1, 1, false)) //
		// 	.addRoomDown(new Room(1, 1))
		// 	.addRoomRight(new Room(2, 1))
		// 	.addRoomDown(new Room(1, 1))
		// 	.addRoomLeft(new Room(2, 1));
		// let ship = builder.build();
		// let shipCanvas = generateMenuShip(); //generateShipGraphic(ship);
		// this.textures.addCanvas("ship", shipCanvas);
		// let image = this.add.image(200, 0, "ship");
		// image.setOrigin(0, 0);
	}
}
