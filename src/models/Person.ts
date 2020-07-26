import type Room from './Room';
import Point = Phaser.Geom.Point;

export default class Person {
	room: Room;
	roomPosition: Point;

	constructor() {}

	public setRoom(room: Room, position?: Point) {
		if (this.room) {
			this.room.removePerson(this);
		}
		room.addPerson(this, position);
	}
}
