import type Room from './Room';
import { TaskManager } from './Task';
import Vector2 = Phaser.Math.Vector2;

export default class Person {
	room: Room;
	roomPosition: Vector2;
	tasks: TaskManager;

	constructor() {
		this.tasks = new TaskManager(this);
	}

	public setRoom(room: Room, position?: Vector2) {
		if (this.room) {
			this.room.removePerson(this);
		}
		room.addPerson(this, position);
	}
}
