import Scene = Phaser.Scene;
import Container = Phaser.GameObjects.Container;
import type Person from '../models/Person';
import { generateArmTexture, generateBodyTexture, generateHeadTexture, generateLegTexture } from '../generation/generatePerson';
import type GenerationSettings from '../generation/generationSettings';

export default class PersonSprite extends Container {
	protected readonly person: Person;
	private readonly head: Phaser.GameObjects.Image;
	private readonly _body: Phaser.GameObjects.Image;
	private readonly arm1: Phaser.GameObjects.Image;
	private readonly arm2: Phaser.GameObjects.Image;
	private readonly leg1: Phaser.GameObjects.Image;
	private readonly leg2: Phaser.GameObjects.Image;
	protected readonly generationSettings: GenerationSettings;
	protected debugGui;

	private _compHeight: number;
	private _compWidth: number;

	constructor(scene: Scene, person: Person, generationSettings: GenerationSettings) {
		super(scene, 0, 0, null);

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

		this.setSize(this.compWidth, this.compHeight);
	}

	protected setForward() {
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
	}

	get tasks() {
		return this.person.tasks;
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
}
