import Room from "./Room";

export default class Person {
	room: Room;
	constructor() {}

	public setRoom(room: Room) {
		room.addPerson(this);
	}
}
