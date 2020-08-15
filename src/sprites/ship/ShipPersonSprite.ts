import PersonSprite from '../PersonSprite';
import type ShipHull from '../../scenes/ShipHull';
import type Person from '../../models/Person';
import type GenerationSettings from '../../generation/generationSettings';
import { MoveTask } from '../../models/Task';
import type Room from '../../models/Room';
import Vector2 = Phaser.Math.Vector2;
import Rectangle = Phaser.GameObjects.Rectangle;
import type Selectable from './Selectable';
import dat from 'dat.gui';

export default class ShipPersonSprite extends PersonSprite implements Selectable {
	protected parent: ShipHull;
	protected highlightBox: Phaser.GameObjects.Rectangle;
	constructor(parent: ShipHull, person: Person, generationSettings: GenerationSettings) {
		super(parent, person, generationSettings);
		this.parent = parent;

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

	incrementMovement(task: MoveTask, movement?: number) {
		if (task.isComplete) {
			return;
		}
		if (movement == undefined) {
			movement = 3;
		}
		let currentTarget: Room = task.currentTarget.room;
		let currentTargetSprite = this.parent.getRoomSprite(currentTarget);
		let currentTargetPosition = currentTargetSprite.personWorldPosition(task.currentTarget.position);
		let curPos = new Vector2(this.x, this.bottom);
		let diff = curPos.subtract(currentTargetPosition).negate();
		let distanceToTarget = diff.length();

		if (distanceToTarget > movement) {
			diff.setLength(movement);
		}
		this.setPosition(this.x + diff.x, this.y + diff.y);
		if (distanceToTarget < movement) {
			task.completeStep();
			this.incrementMovement(task, diff.length());
		}
	}

	update(time: number, delta: number) {
		if (this.tasks.current instanceof MoveTask) {
			this.incrementMovement(this.tasks.current);
		}
	}

	get roomSprite() {
		return this.parent.getRoomSprite(this.room);
	}

	get room() {
		return this.person.room;
	}

	public moveToPosition() {
		let position = this.roomSprite.personWorldPosition(this.person.roomPosition);
		this.setPosition(position.x, position.y - this.compHeight / 2);
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

	protected setForward() {
		super.setForward();

		this.setupHover();
	}
}
