import Person from "./Person";
import Ship from "./Ship";

interface RoomPosition {
	room: Room;
	position: number;
}

export default class Room {
	private readonly _width: number;
	private readonly _height: number;
	private ship: Ship;
	gridPosition: { x: number; y: number };
	people: Person[] = [];

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	inside: boolean;

	upRoom: RoomPosition;
	downRoom: RoomPosition;
	leftRoom: RoomPosition;
	rightRoom: RoomPosition;

	constructor(width: number, height: number, inside?: boolean) {
		this._width = width;
		this._height = height;
		if (inside == undefined) {
			this.inside = true;
		} else {
			this.inside = inside;
		}
	}

	get outside() {
		return !this.inside;
	}

	addRoomUp(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		room.setShip(this.ship);
		this.upRoom = { room, position };
		return room;
	}

	addRoomDown(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		room.setShip(this.ship);
		this.downRoom = { room, position };
		return room;
	}

	addRoomLeft(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		room.setShip(this.ship);
		this.leftRoom = { room, position };
		return room;
	}

	addRoomRight(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		room.setShip(this.ship);
		this.rightRoom = { room, position };
		return room;
	}

	setGridPosition(x: number, y: number) {
		this.gridPosition = { x, y };
	}

	setShip(ship: Ship) {
		this.ship = ship;
		let surrounding = [this.upRoom, this.downRoom, this.leftRoom, this.rightRoom];
		surrounding.forEach((roomPos) => {
			if (roomPos && !roomPos.room.ship) {
				roomPos.room.setShip(ship);
			}
		});
	}

	addPerson(person: Person) {
		if (!this.people.includes(person)) {
			this.people.push(person);
		}
		person.room = this;
		return this;
	}
}
