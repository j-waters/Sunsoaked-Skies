import Ship from "../models/Ship";
import { generateHullGraphic } from "../procedural/generateShip";
import RoomSprite from "./RoomSprite";
import GenerationSettings from "../procedural/generationSettings";
import Room from "../models/Room";
import PersonSprite from "./PersonSprite";
import Person from "../models/Person";

export default class ShipHull extends Phaser.GameObjects.Container {
	private readonly generationSettings: GenerationSettings;
	private background: Phaser.GameObjects.Image;
	private roomSprites: RoomSprite[] = [];
	constructor(scene: Phaser.Scene, ship: Ship) {
		super(scene, 0, 0);

		this.generationSettings = new GenerationSettings(2);

		let shipCanvas = generateHullGraphic(ship, this.generationSettings);
		scene.textures.addCanvas("ship", shipCanvas);
		this.background = new Phaser.GameObjects.Image(scene, 0, 0, "ship");
		// image.setOrigin(0.5, 0.5);

		this.add(this.background);

		ship.rooms.forEach((room) => {
			this.addRoom(room);
			this.addPeople(room.people);
		});
	}

	private addRoom(room: Room) {
		let roomSprite = new RoomSprite(this.scene, this, room, this.generationSettings);
		let xOffset = this.background.width / 2;
		let yOffset = this.background.height / 2;
		roomSprite.setPosition(
			room.gridPosition.x * this.generationSettings.roomSizeMargin - xOffset + this.generationSettings.margin,
			room.gridPosition.y * this.generationSettings.roomSizeMargin - yOffset + this.generationSettings.margin
		);
		roomSprite.setOrigin(0, 0);
		this.roomSprites.push(roomSprite);
		this.add(roomSprite);
		roomSprite.setupHover();
		console.log(room.gridPosition, room.width, roomSprite.x, roomSprite.y);
	}

	private addPeople(people: Person[]) {
		people.forEach((person) => {
			let personSprite = new PersonSprite(this.scene, person, this.generationSettings);
			this.add(personSprite);
			personSprite.setRoomPosition(this.roomSprites);
		});
	}
}
