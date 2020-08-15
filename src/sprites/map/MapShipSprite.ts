import type WorldMap from '../../scenes/WorldMap';
import type Ship from '../../models/Ship';

export const POSITIVE_ZERO = 0.0001;

export default class MapShipSprite extends Phaser.GameObjects.Sprite {
	ship: Ship;
	private parent: WorldMap;
	constructor(parent: WorldMap, ship: Ship) {
		super(parent, 0, 0, ship.generateTopDownTexture(parent));
		this.ship = ship;
		this.parent = parent;
		let mod = parent.mapSize / 512;
		this.setPosition(this.ship.position.x * mod, this.ship.position.y * mod);
	}

	update() {
		this.ship.iterateMovement();
		this.setRotation(this.ship.velocity.angle() - Math.PI / 2);
		this.setPosition(this.ship.position.x, this.ship.position.y);
	}

	moveTo(curve: Phaser.Curves.CubicBezier) {
		this.ship.targetCurve = curve;
		this.ship.distance = 0;
	}
}
