import type Person from './Person';
import type Ship from './Ship';
import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;

console.log('');

export interface RoomRelation {
	room: Room;
	thisPosition: Vector2;
	theirPosition: Vector2;
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

	addRoom(room: Room, direction: Direction, thisPosition?: Vector2, theirPosition?: Vector2) {
		room.setShip(this.ship);
		if (thisPosition == undefined) {
			switch (direction) {
				case 'UP':
					thisPosition = new Vector2(0, 0);
					break;
				case 'DOWN':
					thisPosition = new Vector2(0, this.height - 1);
					break;
				case 'LEFT':
					thisPosition = new Vector2(0, 0);
					break;
				case 'RIGHT':
					thisPosition = new Vector2(this.width - 1, 0);
					break;
			}
		}
		if (theirPosition == undefined) {
			theirPosition = new Vector2(0, 0);
		}
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

	addRoomUp(room: Room, thisPosition?: Vector2, theirPosition?: Vector2) {
		return this.addRoom(room, 'UP', thisPosition, theirPosition);
	}

	addRoomDown(room: Room, thisPosition?: Vector2, theirPosition?: Vector2) {
		return this.addRoom(room, 'DOWN', thisPosition, theirPosition);
	}

	addRoomLeft(room: Room, thisPosition?: Vector2, theirPosition?: Vector2) {
		return this.addRoom(room, 'LEFT', thisPosition, theirPosition);
	}

	addRoomRight(room: Room, thisPosition?: Vector2, theirPosition?: Vector2) {
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

	addPerson(person: Person, position?: Vector2) {
		if (!this.people.includes(person)) {
			this.people.push(person);
		}
		person.room = this;
		if (position) {
			person.roomPosition = position;
		} else {
			person.roomPosition = new Vector2(this.people.length - 1, this.height - 1);
		}
		return this;
	}

	removePerson(person: Person) {
		this.people.splice(this.people.indexOf(person), 1);
	}

	onPersonLeave() {
		this.people.forEach((person) => {
			if (person.roomPosition.x > this.firstAvailableSpace) {
				person.tasks.addMoveTo(this);
			}
		});
	}

	get firstAvailableSpace() {
		for (let x = 0; x < this.personSlots[this.personSlots.length - 1].length; x++) {
			if (this.personSlots[this.personSlots.length - 1][x] == null) {
				return x;
			}
		}
	}

	get personSlots(): Person[][] {
		let slots = Array(this.height);
		slots.fill(Array(Room.possiblePositions(this.width)).fill(null));
		this.people.forEach((person) => {
			if (person.roomPosition.x % 1 == 0 && person.roomPosition.y % 1 == 0) {
				slots[person.roomPosition.y][person.roomPosition.x] = person;
			}
		});
		return slots;
	}

	abstract get name(): string;

	static possiblePositions(size: number) {
		return size == 1 ? 2 : size == 2 ? 3 : 5;
	}
}
