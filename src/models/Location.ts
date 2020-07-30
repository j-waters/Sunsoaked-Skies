import Point = Phaser.Geom.Point;

interface LocationConfig {}

export default class Location {
	position: Phaser.Geom.Point;
	private config: LocationConfig;
	constructor(position: Point, config: LocationConfig) {
		this.position = position;
		this.config = config;
	}
}
