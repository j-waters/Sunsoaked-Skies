import type Room from './Room';
import { generateGrid } from '../generation/generateShip';
import Person from './Person';

export default class Ship {
	rootRoom: Room;

	constructor(rootRoom: Room) {
		this.rootRoom = rootRoom;
	}

	public static builder() {
		return new ShipBuilder();
	}

	public get roomGrid() {
		return generateGrid(this.rootRoom);
	}

	public get people() {
		return this.rooms.flatMap((room) => room.people);
	}

	public get rooms(): Room[] {
		let rooms = [];
		this.roomGrid.forEach((row, y) => {
			row.forEach((room, x) => {
				if (room && !rooms.includes(room)) {
					room.setGridPosition(x, y);
					rooms.push(room);
				}
			});
		});
		return rooms;
	}
}

class ShipBuilder {
	private rootRoom: Room;

	createRootRoom(room: Room) {
		this.rootRoom = room;
		return this.rootRoom;
	}

	build() {
		let ship = new Ship(this.rootRoom);
		ship.rootRoom.setShip(ship);
		return ship;
	}
}
