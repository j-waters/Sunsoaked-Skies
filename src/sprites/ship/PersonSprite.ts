import Scene = Phaser.Scene;
import Container = Phaser.GameObjects.Container;
import type Person from '../../models/Person';
import { generateArmTexture, generateBodyTexture, generateHeadTexture, generateLegTexture } from '../../generation/generatePerson';
import type GenerationSettings from '../../generation/generationSettings';
import Rectangle = Phaser.GameObjects.Rectangle;
import type RoomSprite from './RoomSprite';
import type Selectable from './Selectable';
import type ShipHull from '../../scenes/ShipHull';
import pathfind from '../../generation/pathfinding';
import type Room from '../../models/Room';
import Point = Phaser.Geom.Point;
import dat from 'dat.gui';
import Vector2 = Phaser.Math.Vector2;

export default class PersonSprite extends Container implements Selectable {
	private readonly person: Person;
	private readonly head: Phaser.GameObjects.Image;
	private readonly _body: Phaser.GameObjects.Image;
	private readonly arm1: Phaser.GameObjects.Image;
	private readonly arm2: Phaser.GameObjects.Image;
	private readonly leg1: Phaser.GameObjects.Image;
	private readonly leg2: Phaser.GameObjects.Image;
	private readonly generationSettings: GenerationSettings;
	private debugGui;

	protected parent: ShipHull;
	protected highlightBox: Phaser.GameObjects.Rectangle;
	private movementQueue: { room: Room; position: Vector2 }[] = [];
	private _compHeight: number;
	private _compWidth: number;

	constructor(parent: ShipHull, person: Person, generationSettings: GenerationSettings) {
		super(parent, 0, 0, null);

		this.parent = parent;

		this.person = person;

		this.generationSettings = generationSettings;

		this.head = new Phaser.GameObjects.Image(this.scene, 0, 0, generateHeadTexture(this.scene, person, this.generationSettings));
		this.head.setOrigin(0.5, 0.9);
		this.add(this.head);

		this._body = new Phaser.GameObjects.Image(this.scene, 0, 0, generateBodyTexture(this.scene, person, this.generationSettings));
		this.add(this._body);

		this.arm1 = new Phaser.GameObjects.Image(this.scene, 0, 0, generateArmTexture(this.scene, person, this.generationSettings));
		this.arm1.setOrigin(0.2, 0);
		this.add(this.arm1);

		this.arm2 = new Phaser.GameObjects.Image(this.scene, 0, 0, generateArmTexture(this.scene, person, this.generationSettings));
		this.arm2.setOrigin(0.8, 0);
		this.add(this.arm2);

		this.leg1 = new Phaser.GameObjects.Image(this.scene, 0, 0, generateLegTexture(this.scene, person, this.generationSettings));
		this.leg1.setOrigin(0.5, 0);
		this.add(this.leg1);

		this.leg2 = new Phaser.GameObjects.Image(this.scene, 0, 0, generateLegTexture(this.scene, person, this.generationSettings));
		this.leg2.setOrigin(0.5, 0);
		this.add(this.leg2);

		this.setForward();

		let rect = new Phaser.Geom.Rectangle(-this.compWidth / 2, -this.compHeight / 2, this.compWidth, this.compHeight);
		this.setSize(this.compWidth, this.compHeight);

		this.setInteractive({ useHandCursor: true }, Phaser.Geom.Rectangle.Contains);

		this.on(Phaser.Input.Events.POINTER_DOWN, (pointer, x, y, event) => {
			this.parent.select(this);
			event.stopPropagation();
			console.log('Clicked:', this);
		});

		if (true) {
			this.debugGui = new dat.GUI();
			this.debugGui.add(this.person.roomPosition, 'x');
			this.debugGui.hide();
		}
	}

	private setForward() {
		this.leg1.setPosition(this.generationSettings.legConfig.xOffset, this.generationSettings.legConfig.yOffset);
		this.leg2.setPosition(-this.generationSettings.legConfig.xOffset, this.generationSettings.legConfig.yOffset);
		this.moveTo(this.leg1, 1);
		this.moveTo(this.leg2, 1);

		this.arm1.setPosition(this.generationSettings.armConfig.xOffset, this.generationSettings.armConfig.yOffset);
		this.arm2.setPosition(-this.generationSettings.armConfig.xOffset, this.generationSettings.armConfig.yOffset);
		this.moveTo(this.arm1, 3);
		this.moveTo(this.arm2, 3);

		this.head.setPosition(this.generationSettings.headConfig.xOffset, this.generationSettings.headConfig.yOffset);
		this.moveTo(this.head, 4);

		this._body.setPosition(0, 0);
		this.moveTo(this._body, 2);

		this.setupHover();
	}

	private setupHover() {
		let thickness = this.generationSettings.strokeThickness / 2;
		this.highlightBox = new Rectangle(this.scene, 0, 0, this.compWidth, this.compHeight);

		this.highlightBox.setVisible(false);
		// this.highlightBox.setOrigin(0, 0);
		this.add(this.highlightBox);

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

	public moveToPosition() {
		let position = this.roomSprite.personWorldPosition(this.person.roomPosition);
		this.setPosition(position.x, position.y - this.compHeight / 2);
	}

	setPosition(x?: number, y?: number, z?: number, w?: number): this {
		return super.setPosition(x, y, z, w);
	}

	get roomSprite() {
		return this.parent.getRoomSprite(this.room);
	}

	get room() {
		return this.person.room;
	}

	toRoom(roomSprite: RoomSprite) {
		let route = pathfind(this.person, roomSprite.room);
		console.log(
			'Specific route:',
			route.map((i) => i),
		);
		this.movementQueue = route;
	}

	get bottom() {
		return this.y + this.compHeight / 2;
	}

	get compWidth() {
		this._compWidth = this._compWidth ?? this.getBounds().width;
		return this._compWidth;
	}

	get compHeight() {
		this._compHeight = this._compHeight ?? this.getBounds().height;
		return this._compHeight;
	}

	incrementMovement(movement?: number) {
		// return;
		if (this.movementQueue.length == 0) {
			return;
		}
		if (movement == undefined) {
			movement = 3;
		}
		let currentTarget = this.movementQueue[0].room;
		let currentTargetSprite = this.parent.getRoomSprite(currentTarget);
		let currentTargetPosition = currentTargetSprite.personWorldPosition(this.movementQueue[0].position);
		let curPos = new Vector2(this.x, this.bottom);
		let diff = curPos.subtract(currentTargetPosition).negate();
		let distanceToTarget = diff.length();

		if (distanceToTarget > movement) {
			diff.setLength(movement);
		}
		this.setPosition(this.x + diff.x, this.y + diff.y);
		if (distanceToTarget < movement) {
			// console.log('got to', this.movementQueue[0], currentTargetPosition, curPos, diff);
			this.person.setRoom(this.movementQueue[0].room, this.movementQueue[0].position);
			this.movementQueue.shift();
			this.incrementMovement(diff.length());
		}
	}

	update(time: number, delta: number) {
		this.incrementMovement();
	}
}
