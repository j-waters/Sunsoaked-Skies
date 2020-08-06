import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;

export abstract class Location {
	position: Vector2;
	abstract icon: string;
	constructor(position: Vector2) {
		this.position = position;
	}
}

export class RuinLocation extends Location {
	icon = 'map/ruin';
	constructor(position: Phaser.Math.Vector2) {
		super(position);
	}
}

export class VillageLocation extends Location {
	icon = 'map/village';
	constructor(position: Phaser.Math.Vector2) {
		super(position);
	}
}
