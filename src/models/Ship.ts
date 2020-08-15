import type Room from './Room';
import { generateGrid, generateHullGraphic, generateTopDownShipGraphic } from '../generation/generateShip';
import type World from './World';
import Vector2 = Phaser.Math.Vector2;
import { POSITIVE_ZERO } from '../sprites/map/MapShipSprite';
import Scene = Phaser.Scene;
import type GenerationSettings from '../generation/generationSettings';
import Curve = Phaser.Curves.Curve;
import type Weapon from './weapons/Weapon';
import { MovementAction } from './MapAction';

export default class Ship {
	rootRoom: Room;
	world: World;
	position: Vector2;
	velocity: Vector2;
	turningModifier: number = 100;
	speed: number = 0.2;
	acceleration: number = 0.001;
	targetCurve: Curve;
	distance: number;
	movementAction: MovementAction;

	constructor(rootRoom: Room) {
		this.rootRoom = rootRoom;
		this.velocity = new Vector2(0, -POSITIVE_ZERO);
		this.movementAction = new MovementAction();
	}

	public get decelerationDistance() {
		return Math.pow(this.velocity.length(), 2) / (2 * this.acceleration);
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

	iterateMovement() {
		if (this.targetCurve) {
			let percentage = this.targetCurve.getTFromDistance(this.distance);

			let point = this.targetCurve.getPointAt(percentage);
			this.velocity.setAngle(this.targetCurve.getTangentAt(percentage).angle());
			this.position = point;

			this.distance += this.velocity.length();

			this.accelerate(this.targetCurve.getLength() - this.distance < this.decelerationDistance);

			if (this.distance >= this.targetCurve.getLength()) {
				this.targetCurve = null;
			}
		} else {
			this.accelerate(true);
			if (this.velocity.length() > POSITIVE_ZERO) {
				this.position.add(this.velocity);
			}
		}
	}

	accelerate(decelerate: boolean = false) {
		if (!decelerate && this.velocity.length() < this.speed) {
			this.velocity.setLength(this.velocity.length() + this.acceleration);
		} else if (decelerate && this.velocity.length() > 0.001) {
			let change = this.velocity.length() - this.acceleration;
			if (change < POSITIVE_ZERO) {
				this.velocity.setLength(POSITIVE_ZERO);
			} else {
				this.velocity.setLength(change);
			}
		}
		if (this.velocity.length() > this.speed) {
			this.velocity.setLength(this.speed);
		}
	}

	get movementProgress() {
		if (!this.targetCurve) return 0;
		return this.distance / this.targetCurve.getLength();
	}

	get weapons(): Weapon[] {
		return this.rooms.map((room) => ('weapons' in room ? <Weapon[]>room['weapons'] : [])).flat();
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
