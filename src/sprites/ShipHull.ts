import type Ship from '../models/Ship';
import { generateHullGraphic } from '../generation/generateShip';
import RoomSprite from './RoomSprite';
import GenerationSettings from '../generation/generationSettings';
import type Room from '../models/Room';
import PersonSprite from './PersonSprite';
import type Person from '../models/Person';
import type Selectable from './components/Selectable';

export default class ShipHull extends Phaser.GameObjects.Container {
	private readonly generationSettings: GenerationSettings;
	private background: Phaser.GameObjects.Image;
	roomSprites: RoomSprite[] = [];
	personSprites: PersonSprite[] = [];
	selected: Selectable = null;
	private ship: Ship;
	constructor(scene: Phaser.Scene, ship: Ship) {
		super(scene, 0, 0);

		this.ship = ship;

		this.generationSettings = new GenerationSettings(2);

		let shipCanvas = generateHullGraphic(ship, this.generationSettings);
		scene.textures.addCanvas('ship', shipCanvas);
		this.background = new Phaser.GameObjects.Image(scene, 0, 0, 'ship');
		// image.setOrigin(0.5, 0.5);

		this.add(this.background);

		this.ship.rooms.forEach((room) => {
			this.addRoom(room);
		});

		this.ship.rooms.forEach((room) => {
			this.addPeople(room.people);
		});

		scene.input.on(Phaser.Input.Events.POINTER_DOWN, (event) => {
			console.log('deselect');
			this.deselect();
		});
	}

	update(time: number, delta: number) {
		this.personSprites.forEach((person) => {
			person.update(time, delta);
		});
	}

	private addRoom(room: Room) {
		let roomSprite = new RoomSprite(this.scene, this, room, this.generationSettings);
		let xOffset = this.background.width / 2;
		let yOffset = this.background.height / 2;
		roomSprite.setPosition(
			room.gridPosition.x * this.generationSettings.roomSizeMargin - xOffset + this.generationSettings.margin,
			room.gridPosition.y * this.generationSettings.roomSizeMargin - yOffset + this.generationSettings.margin,
		);
		roomSprite.setOrigin(0, 0);
		this.roomSprites.push(roomSprite);
		this.add(roomSprite);
		roomSprite.setupHover();
	}

	private addPeople(people: Person[]) {
		people.forEach((person) => {
			let personSprite = new PersonSprite(this.scene, this, person, this.generationSettings);
			this.personSprites.push(personSprite);
			this.add(personSprite);
			this.bringToTop(personSprite);
			personSprite.moveToPosition();
		});
	}

	select(object: Selectable) {
		if (this.selected instanceof PersonSprite && object instanceof RoomSprite) {
			this.selected.toRoom(object);
			return;
		}
		this.deselect();
		this.selected = object;
		this.selected.select();
	}

	deselect() {
		if (this.selected) {
			this.selected.deselect();
			this.selected = null;
		}
	}

	getRoomSprite(room: Room) {
		return this.roomSprites.find((roomSprite) => roomSprite.room == room);
	}
}
