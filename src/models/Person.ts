import type Room from './Room';
import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;

export default class Person {
	room: Room;
	roomPosition: Vector2;

	constructor() {}

	public setRoom(room: Room, position?: Vector2) {
		if (this.room) {
			this.room.removePerson(this);
		}
		room.addPerson(this, position);
	}
}
