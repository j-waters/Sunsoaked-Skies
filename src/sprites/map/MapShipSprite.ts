import type WorldMap from '../../scenes/WorldMap';
import { generateTopDownShipGraphic } from '../../generation/generateShip';
import type Ship from '../../models/Ship';
import Curve = Phaser.Curves.Curve;

export const POSITIVE_ZERO = 0.0001;

export default class MapShipSprite extends Phaser.GameObjects.Sprite {
	ship: Ship;
	private parent: WorldMap;
	targetCurve: Curve;
	progress: number;
	constructor(parent: WorldMap, ship: Ship) {
		super(parent, 0, 0, ship.generateTopDownTexture(parent));
		this.ship = ship;
		this.parent = parent;
		let mod = parent.mapSize / 512;
		this.setPosition(this.ship.position.x * mod, this.ship.position.y * mod);
		this.progress = 0;
	}

	update() {
		if (this.targetCurve) {
			let shouldDecelerate = this.progress > 1 - this.targetCurve.getTFromDistance(this.ship.decelerationDistance);
			this.accelerate(shouldDecelerate);
			let pos = this.targetCurve.getPointAt(this.progress);
			this.ship.velocity.setAngle(this.targetCurve.getTangentAt(this.progress).angle());
			this.setRotation(this.ship.velocity.angle() - Math.PI / 2);
			this.setPosition(pos.x, pos.y);
			let t = this.targetCurve.getTFromDistance(this.ship.velocity.length());
			this.progress += t;
			if (this.progress >= 1) {
				this.targetCurve = null;
			}
		} else {
			this.accelerate(true);
			if (this.ship.velocity.length() > POSITIVE_ZERO) {
				this.x += this.ship.velocity.x;
				this.y += this.ship.velocity.y;
			}
		}
	}

	accelerate(decelerate: boolean = false) {
		if (!decelerate && this.ship.velocity.length() < this.ship.speed) {
			this.ship.velocity.setLength(this.ship.velocity.length() + this.ship.acceleration);
		} else if (decelerate && this.ship.velocity.length() > 0.001) {
			let change = this.ship.velocity.length() - this.ship.acceleration;
			if (change < POSITIVE_ZERO) {
				this.ship.velocity.setLength(POSITIVE_ZERO);
			} else {
				this.ship.velocity.setLength(change);
			}
		}
		if (this.ship.velocity.length() > this.ship.speed) {
			this.ship.velocity.setLength(this.ship.speed);
		}
	}
}
