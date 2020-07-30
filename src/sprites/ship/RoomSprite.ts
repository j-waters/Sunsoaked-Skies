import { generateRoomBackground } from '../../generation/generateRoom';
import type Room from '../../models/Room';
import type GenerationSettings from '../../generation/generationSettings';
import type ShipHull from '../../scenes/ShipHull';
import Sprite = Phaser.GameObjects.Sprite;
import type Selectable from './Selectable';
import Point = Phaser.Geom.Point;
import { possiblePositions } from '../../generation/pathfinding';
import dat from 'dat.gui';

export default class RoomSprite extends Sprite implements Selectable {
	public room: Room;
	private generationSettings: GenerationSettings;
	protected parent: ShipHull;
	protected highlightBox: Phaser.GameObjects.Rectangle;
	private debugGui;
	constructor(parent: ShipHull, roomData: Room, generationSettings: GenerationSettings) {
		let texture = parent.textures.addCanvas(null, generateRoomBackground(roomData, generationSettings), true);
		super(parent, 0, 0, texture);

		this.setInteractive({ useHandCursor: true });

		this.parent = parent;

		this.room = roomData;
		this.generationSettings = generationSettings;

		this.on(Phaser.Input.Events.POINTER_DOWN, (pointer, x, y, event) => {
			this.parent.select(this);
			event.stopPropagation();
			console.log('Clicked:', this);
		});

		if (true) {
			this.debugGui = new dat.GUI();
			this.debugGui.hide();
		}
	}

	get selected() {
		return this.parent.selected === this;
	}

	select() {
		this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth, 0xffaa00);
		this.highlightBox.setVisible(true);
		this.debugGui.show();
	}
	deselect() {
		this.highlightBox.setVisible(false);
		this.debugGui.hide();
	}

	// public static create(scene: Scene, parent: ShipHull, room: Room, generationSettings: GenerationSettings) {
	// 	const SelectableRoomSprite = SelectableMixin(RoomSprite);
	// 	return new SelectableRoomSprite(scene, parent, room, generationSettings);
	// }

	public setupHover() {
		let thickness = this.generationSettings.strokeThickness / 2;
		this.highlightBox = this.parent.add.rectangle(this.x + thickness / 2, this.y + thickness / 2, this.width - thickness, this.height - thickness);
		this.highlightBox.setStrokeStyle(thickness, 0xffff00);
		this.highlightBox.setVisible(false);
		this.highlightBox.setOrigin(0, 0);

		this.on(Phaser.Input.Events.POINTER_OVER, (event) => {
			this.highlightBox.setStrokeStyle(thickness, 0xffff00);
			this.highlightBox.setVisible(true);
		});
		this.on(Phaser.Input.Events.POINTER_OUT, (event) => {
			if (this.selected) {
				this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth, 0xffaa00);
			} else {
				this.highlightBox.setVisible(false);
			}
		});
	}

	setPosition(x?: number, y?: number, z?: number, w?: number): this {
		super.setPosition(x, y, z + 1, w);
		if (this.highlightBox) {
			this.highlightBox.setPosition(x, y, z, w);
		}
		return this;
	}

	personWorldPosition(roomPosition: { x: number; y: number }) {
		let positions = possiblePositions(this.room.width);
		let divisor = positions * 2;
		let xPos = this.x + (this.width / divisor) * (roomPosition.x * 2 + 1);
		let yPos = this.y + (roomPosition.y + 1) * (this.height / this.room.height); // this.height - roomPosition.y * (this.height / this.room.height);
		return new Point(xPos, yPos);
	}
}
