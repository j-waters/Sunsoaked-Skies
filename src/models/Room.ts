interface RoomPosition {
	room: Room;
	position: number;
}

export default class Room {
	private readonly _width: number;
	private readonly _height: number;
	gridPosition: { x: number; y: number };

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
		this.upRoom = { room, position };
		return room;
	}

	addRoomDown(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		this.downRoom = { room, position };
		return room;
	}

	addRoomLeft(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		this.leftRoom = { room, position };
		return room;
	}

	addRoomRight(room: Room, position?: number) {
		if (position == undefined) {
			position = 0;
		}
		this.rightRoom = { room, position };
		return room;
	}

	setGridPosition(x: number, y: number) {
		this.gridPosition = { x, y };
	}
}
