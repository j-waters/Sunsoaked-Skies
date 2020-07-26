import type Person from './Person';
import type Ship from './Ship';
import Point = Phaser.Geom.Point;

(function () {})();

console.log('what');

export interface RoomRelation {
	room: Room;
	thisPosition: Point;
	theirPosition: Point;
	direction: Direction;
	automatic?: boolean;
	mirror: RoomRelation;
}

type Coord = [number, number];

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

function oppositeDirection(direction: Direction): Direction {
	switch (direction) {
		case 'UP':
			return 'DOWN';
		case 'DOWN':
			return 'UP';
		case 'LEFT':
			return 'RIGHT';
		case 'RIGHT':
			return 'LEFT';
	}
}

export default abstract class Room {
	private readonly _width: number;
	private readonly _height: number;
	ship?: Ship;
	gridPosition?: { x: number; y: number };
	people: Person[] = [];

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	inside: boolean;

	neighbours: RoomRelation[] = [];

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

	addRoom(room: Room, direction: Direction, thisPosition?: Point | Coord, theirPosition?: Point | Coord) {
		room.setShip(this.ship);
		if (thisPosition == undefined) {
			thisPosition = new Point(0, 0);
		}
		if (thisPosition instanceof Array) {
			thisPosition = new Point(thisPosition[0], thisPosition[1]);
		}
		if (theirPosition == undefined) {
			theirPosition = new Point(0, 0);
		}
		if (theirPosition instanceof Array) {
			theirPosition = new Point(theirPosition[0], theirPosition[1]);
		}
		// if (
		// 	this.neighbours.filter((roomPosition) => {
		// 		return roomPosition.room == room || (roomPosition.direction == direction && roomPosition.position == thisPosition);
		// 	}).length > 0
		// ) {
		// 	console.warn(
		// 		"Invalid room placement",
		// 		{ room, direction, position },
		// 		"at",
		// 		room,
		// 		"- room spot taken by",
		// 		this.neighbours.filter((roomPosition) => {
		// 			return !(roomPosition.room == room || (roomPosition.direction == direction && roomPosition.position == position));
		// 		})
		// 	);
		// 	return;
		// }
		let thisRelation = {
			room,
			direction,
			thisPosition,
			theirPosition,
			mirror: undefined,
		};
		let theirRelation = {
			room: this,
			direction: oppositeDirection(direction),
			automatic: true,
			thisPosition: theirPosition,
			theirPosition: thisPosition,
			mirror: undefined,
		};
		thisRelation.mirror = theirRelation;
		theirRelation.mirror = thisRelation;
		this.neighbours.push(thisRelation);
		room.neighbours.push(theirRelation);

		return room;
	}

	addRoomUp(room: Room, thisPosition?: Point | Coord, theirPosition?: Point | Coord) {
		return this.addRoom(room, 'UP', thisPosition, theirPosition);
	}

	addRoomDown(room: Room, thisPosition?: Point | Coord, theirPosition?: Point | Coord) {
		return this.addRoom(room, 'DOWN', thisPosition, theirPosition);
	}

	addRoomLeft(room: Room, thisPosition?: Point | Coord, theirPosition?: Point | Coord) {
		return this.addRoom(room, 'LEFT', thisPosition, theirPosition);
	}

	addRoomRight(room: Room, thisPosition?: Point | Coord, theirPosition?: Point | Coord) {
		return this.addRoom(room, 'RIGHT', thisPosition, theirPosition);
	}

	setGridPosition(x: number, y: number) {
		this.gridPosition = { x, y };
	}

	setShip(ship?: Ship) {
		this.ship = ship;
		this.neighbours.forEach((roomPos) => {
			if (roomPos && !roomPos.room.ship) {
				roomPos.room.setShip(ship);
			}
		});
	}

	addPerson(person: Person, position?: Point) {
		if (!this.people.includes(person)) {
			this.people.push(person);
		}
		person.room = this;
		if (position) {
			person.roomPosition = position;
		} else {
			person.roomPosition = new Point(this.people.length - 1, this.height - 1);
		}
		return this;
	}

	removePerson(person: Person) {
		this.people.splice(this.people.indexOf(person), 1);
	}

	abstract get name(): string;
}
