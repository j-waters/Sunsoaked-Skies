import Room from "./Room";

export default class Ship {
	rootRoom: Room;

	constructor(rootRoom: Room) {
		this.rootRoom = rootRoom;
	}

	public static builder() {
		return new ShipBuilder();
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
