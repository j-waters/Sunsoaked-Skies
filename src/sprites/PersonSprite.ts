import Scene = Phaser.Scene;
import Container = Phaser.GameObjects.Container;
import Person from "../models/Person";
import { generateArmTexture, generateBodyTexture, generateHeadGraphic, generateHeadTexture, generateLegTexture } from "../procedural/generatePerson";
import GenerationSettings from "../procedural/generationSettings";
import Rectangle = Phaser.GameObjects.Rectangle;
import RoomSprite from "./RoomSprite";

export default class PersonSprite extends Phaser.GameObjects.Container {
	private person: Person;
	private head: Phaser.GameObjects.Image;
	private _body: Phaser.GameObjects.Image;
	private arm1: Phaser.GameObjects.Image;
	private arm2: Phaser.GameObjects.Image;
	private leg1: Phaser.GameObjects.Image;
	private leg2: Phaser.GameObjects.Image;
	private generationSettings: GenerationSettings;
	private highlightBox: Phaser.GameObjects.Rectangle;
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

		let rect = new Phaser.Geom.Rectangle(-this.getBounds().width / 2, -this.getBounds().height / 2, this.getBounds().width, this.getBounds().height);

		this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
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
		this.highlightBox = new Rectangle(this.scene, 0, 0, this.getBounds().width, this.getBounds().height);
		this.highlightBox.setStrokeStyle(thickness, 0xffff00);
		this.highlightBox.setVisible(false);
		// this.highlightBox.setOrigin(0, 0);
		this.add(this.highlightBox);

		this.on("pointerover", (event) => {
			console.log("hover", this.highlightBox.x);
			this.highlightBox.setVisible(true);
		});
		this.on("pointerout", (event) => {
			console.log("nohover", this.highlightBox.x);
			this.highlightBox.setVisible(false);
		});
	}

	public setRoomPosition(roomSprites: RoomSprite[]) {
		roomSprites.forEach((roomSprite) => {
			let room = roomSprite.room;
			if (room == this.person.room) {
				let positions = room.width == 1 ? 2 : room.width == 2 ? 3 : 5;
				let divisor = positions * 2;
				let xPos = roomSprite.x + (roomSprite.width / divisor) * (roomSprite.room.people.indexOf(this.person) * 2 + 1);
				this.setPosition(xPos, roomSprite.y + roomSprite.height - this.getBounds().height / 2);
			}
		});
	}
}

/*
1 -> 2
2 -> 3
3 -> 5

 */
