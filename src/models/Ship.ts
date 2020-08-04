import type Room from './Room';
import { generateGrid, generateHullGraphic, generateTopDownShipGraphic } from '../generation/generateShip';
import type World from './World';
import Vector2 = Phaser.Math.Vector2;
import { POSITIVE_ZERO } from '../sprites/map/MapShipSprite';
import Scene = Phaser.Scene;
import type GenerationSettings from '../generation/generationSettings';

export default class Ship {
	rootRoom: Room;
	world: World;
	position: Vector2;
	velocity: Vector2;
	turningModifier: number = 100;
	speed: number = 5;
	acceleration: number = 0.01;

	constructor(rootRoom: Room) {
		this.rootRoom = rootRoom;
		this.velocity = new Vector2(0, POSITIVE_ZERO);
	}

	public get decelerationDistance() {
		return this.velocity.length() / (2 * this.acceleration);
	}

	public generateTexture(scene: Scene, gs: GenerationSettings) {
		if (scene.textures.exists('ship_hull')) {
			return scene.textures.get('ship_hull');
		}
		let shipCanvas = generateHullGraphic(this, gs);
		return scene.textures.addCanvas('ship_hull', shipCanvas);
	}

	public generateTopDownTexture(scene: Scene) {
		if (scene.textures.exists('ship_top_down')) {
			return scene.textures.get('ship_top_down');
		}
		let shipCanvas = generateTopDownShipGraphic(this);
		return scene.textures.addCanvas('ship_top_down', shipCanvas);
	}

	public static builder() {
		return new ShipBuilder();
	}

	public get roomGrid() {
		return generateGrid(this.rootRoom);
	}

	public get people() {
		return this.rooms.flatMap((room) => room.people);
	}

	public get rooms(): Room[] {
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
	private rootRoom: Room;

	createRootRoom(room: Room) {
		this.rootRoom = room;
		return this.rootRoom;
	}

	build() {
		let ship = new Ship(this.rootRoom);
		ship.rootRoom.setShip(ship);
		return ship;
	}
}
