import { SceneBase } from "./SceneBase";
import { generateMenuShip } from "../procedural/generateShip";
import { generatePersonGraphic } from "../procedural/generatePerson";
import Person from "../models/Person";
import { createBackground } from "../procedural/generateBackground";
import GenerationSettings from "../procedural/generationSettings";

export class Menu extends SceneBase {
	private backgroundShips;
	constructor() {
		super("Menu");
	}
	public preload() {
		// this.textures.addSpriteSheet(`menu_person`, generatePersonGraphic(new Person()), { personWidth: 50, personHeight: 50, spacing: 10 });
	}
	public create(): void {
		console.log("GAME WIDTH HEIGHT", this.gameWidth, this.gameHeight, this.gameWidth);
		createBackground(this);
		let background = this.add.image(0, 0, "gradient_background");
		background.setOrigin(0, 0);

		this.backgroundShips = this.add.group();
		this.createBackgroundShips();

		let hill = this.add.image(this.gameWidth / 2, this.gameHeight, "menu/hill");
		hill.setOrigin(0.5, 1);
		hill.setDisplaySize(this.gameWidth * 0.6, this.gameHeight * 0.15);

		let p = generatePersonGraphic(new Person(), new GenerationSettings());
		p.onload = () => {
			this.textures.addImage("menu_person", p);
			let person = this.add.image(this.gameWidth / 2, this.gameHeight * 0.9, "menu_person");
			person.setOrigin(0.5, 1);
			person.setDisplaySize(this.gameWidth * 0.05, ((this.gameWidth * 0.05) / person.displayWidth) * person.displayHeight);
		};
	}
	public update(time: number, delta: number): void {
		this.backgroundShips.getChildren().forEach((image: Phaser.GameObjects.Image) => {
			image.x += image.getData("speed");
			if (image.x + image.displayWidth < 0) {
				image.setData("speed", Math.abs(image.getData("speed")));
				image.setFlipX(false);
				image.setY(Phaser.Math.FloatBetween(0, this.gameHeight));
			}
			if (image.x - image.displayWidth > this.gameWidth) {
				image.setData("speed", -Math.abs(image.getData("speed")));
				image.setFlipX(true);
				image.setY(Phaser.Math.FloatBetween(0, this.gameHeight));
			}
		});
	}

	private createBackgroundShips() {
		this.backgroundShips.clear(true, true);
		for (let i = 0; i < 25; i++) {
			let texture = this.textures.addCanvas(null, generateMenuShip(), true);
			let image = this.add.image(Phaser.Math.FloatBetween(-200, this.gameWidth + 200), Phaser.Math.FloatBetween(0, this.gameHeight), texture);
			const direction = Phaser.Math.Between(0, 1) == 0;
			const scale = Phaser.Math.FloatBetween(0.5, 1.5);
			image.setDisplaySize(30 * scale, 30 * scale);
			image.setFlipX(direction);

			image.setData("speed", 0.5 * Phaser.Math.FloatBetween(0.2, 0.6) * scale * (direction ? -1 : 1));

			this.backgroundShips.add(image);
		}
	}
}
