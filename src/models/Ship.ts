import Room from "./Room";
import { generateGrid } from "../procedural/generateShip";

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

	createRootRoom(width: number, height: number, inside?: boolean) {
		this.rootRoom = new Room(width, height, inside);
		return this.rootRoom;
	}

	build() {
		return new Ship(this.rootRoom);
	}
}
