import { generateRoomBackground } from "../procedural/generateRoom";
import Scene = Phaser.Scene;
import Room from "../models/Room";
import GenerationSettings from "../procedural/generationSettings";
import Container = Phaser.GameObjects.Container;
import Rectangle = Phaser.GameObjects.Rectangle;

export default class RoomSprite extends Phaser.GameObjects.Sprite {
	private roomData: Room;
	private highlightBox: Phaser.GameObjects.Rectangle;
	private parent: Phaser.GameObjects.Container;
	private generationSettings: GenerationSettings;
	constructor(scene: Scene, parent: Container, roomData: Room, generationSettings: GenerationSettings) {
		let texture = scene.textures.addCanvas(null, generateRoomBackground(roomData, generationSettings), true);
		super(scene, 0, 0, texture);

		this.parent = parent;

		this.setInteractive();

		this.roomData = roomData;
		this.generationSettings = generationSettings;
	}

	public setupHover() {
		let thickness = this.generationSettings.strokeThickness / 2;
		this.highlightBox = new Rectangle(this.scene, this.x + thickness / 2, this.y + thickness / 2, this.width - thickness, this.height - thickness);
		this.highlightBox.setStrokeStyle(thickness, 0xffff00);
		this.highlightBox.setVisible(false);
		this.highlightBox.setOrigin(0, 0);
		this.parent.add(this.highlightBox);

		this.on("pointerover", (event) => {
			console.log("hover", this.highlightBox.x);
			this.highlightBox.setVisible(true);
		});
		this.on("pointerout", (event) => {
			console.log("nohover", this.highlightBox.x);
			this.highlightBox.setVisible(false);
		});
	}

	setPosition(x?: number, y?: number, z?: number, w?: number): this {
		super.setPosition(x, y, z + 1, w);
		if (this.highlightBox) {
			this.highlightBox.setPosition(x, y, z, w);
		}
		return this;
	}
}
