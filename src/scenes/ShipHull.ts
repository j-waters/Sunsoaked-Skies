import type Ship from '../models/Ship';
import RoomSprite from '../sprites/ship/RoomSprite';
import GenerationSettings from '../generation/generationSettings';
import type Room from '../models/Room';
import type Person from '../models/Person';
import type Selectable from '../sprites/ship/Selectable';
import { SceneBase } from './SceneBase';
import ShipPersonSprite from '../sprites/ship/ShipPersonSprite';

export default class ShipHull extends SceneBase {
	private generationSettings: GenerationSettings;
	private background: Phaser.GameObjects.Image;
	roomSprites: RoomSprite[] = [];
	personSprites: ShipPersonSprite[] = [];
	selected: Selectable = null;
	private ship: Ship;

	create(data: { ship: Ship }) {
		this.ship = data.ship;

		this.generationSettings = new GenerationSettings(2);

		this.background = this.add.image(this.gameWidth / 2, this.gameHeight / 2, this.ship.generateTexture(this, this.generationSettings));
		// image.setOrigin(0.5, 0.5);

		this.ship.rooms.forEach((room) => {
			this.addRoom(room);
		});

		this.ship.rooms.forEach((room) => {
			this.addPeople(room.people);
		});

		this.input.on(Phaser.Input.Events.POINTER_DOWN, (event) => {
			console.log('deselect');
			this.deselect();
		});

		this.events.on(Phaser.Scenes.Events.WAKE, () => this.wake());
		this.wake();
	}

	wake() {
		this.input.setDefaultCursor(`initial`);
	}

	update(time: number, delta: number) {
		this.personSprites.forEach((person) => {
			person.update(time, delta);
		});
	}

	private addRoom(room: Room) {
		const roomSprite = new RoomSprite(this, room, this.generationSettings);
		const xOffset = this.background.width / 2;
		const yOffset = this.background.height / 2;
		roomSprite.setPosition(
			room.gridPosition.x * this.generationSettings.roomSizeMargin - xOffset + this.generationSettings.margin + this.gameWidth / 2,
			room.gridPosition.y * this.generationSettings.roomSizeMargin - yOffset + this.generationSettings.margin + this.gameHeight / 2,
		);
		roomSprite.setOrigin(0, 0);
		this.roomSprites.push(roomSprite);
		this.add.existing(roomSprite);
		roomSprite.setupHover();
	}

	private addPeople(people: Person[]) {
		people.forEach((person) => {
			const personSprite = new ShipPersonSprite(this, person, this.generationSettings);
			this.personSprites.push(personSprite);
			this.add.existing(personSprite);
			// this.bringToTop(personSprite);
			personSprite.moveToPosition();
		});
	}

	select(object: Selectable) {
		if (this.selected instanceof ShipPersonSprite && object instanceof RoomSprite) {
			this.selected.tasks.addMoveTo(object.room);
			// this.selected.toRoom(object);
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
