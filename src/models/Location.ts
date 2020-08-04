import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;

interface LocationConfig {}

export default class Location {
	position: Vector2;
	private config: LocationConfig;
	constructor(position: Vector2, config: LocationConfig) {
		this.position = position;
		this.config = config;
	}
}
