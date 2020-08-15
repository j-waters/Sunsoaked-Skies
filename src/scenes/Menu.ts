import { SceneBase } from './SceneBase';
import { generateMenuShip } from '../generation/generateShip';
import Person from '../models/Person';
import { createBackground } from '../generation/generateBackground';
import GenerationSettings from '../generation/generationSettings';
import PersonSprite from '../sprites/PersonSprite';
import NewGameState from '../states/NewGameState';
import TextStyle = Phaser.GameObjects.TextStyle;

export default class Menu extends SceneBase {
	private backgroundShips: Phaser.GameObjects.Group;

	public create(): void {
		createBackground(this);
		const background = this.add.image(0, 0, 'gradient_background');
		background.setOrigin(0, 0);

		this.backgroundShips = this.add.group();
		this.createBackgroundShips();

		const hill = this.add.image(this.gameWidth / 2, this.gameHeight, 'menu/hill');
		hill.setOrigin(0.5, 1);
		hill.setDisplaySize(this.gameWidth * 0.6, this.gameHeight * 0.15);

		const person = new PersonSprite(this, new Person(), new GenerationSettings());
		this.add.existing(person);
		person.setPosition(this.gameWidth / 2, this.gameHeight * 0.85);
		person.setDisplaySize(this.gameWidth * 0.05, ((this.gameWidth * 0.05) / person.displayWidth) * person.displayHeight);

		const title = this.add.text(this.gameWidth / 2, this.gameHeight * 0.3, 'Sunsoaked\nSkies', {
			fontFamily: 'Elder Magic Shadow',
			color: 'rgb(0, 0, 0)',
			fontSize: '128px',
			align: 'center',
		} as TextStyle);
		title.setOrigin(0.5, 0.5);

		const newGameButton = this.add.text(this.gameWidth / 2, this.gameHeight * 0.55, 'New Game', {
			fontFamily: 'Elder Magic',
			color: 'rgb(0, 0, 0)',
			fontSize: '64px',
			align: 'center',
		} as TextStyle);
		newGameButton.setOrigin(0.5, 0.5);
		newGameButton.setInteractive({ useHandCursor: true });
		newGameButton.on(Phaser.Input.Events.POINTER_OVER, () => newGameButton.setColor('rgb(73,0,63)'));
		newGameButton.on(Phaser.Input.Events.POINTER_OUT, () => newGameButton.setColor('rgb(0, 0, 0)'));
		newGameButton.on(Phaser.Input.Events.POINTER_DOWN, () => this.state.start(NewGameState));
	}

	public update(time: number, delta: number): void {
		this.backgroundShips.getChildren().forEach((image: Phaser.GameObjects.Image) => {
			image.x += image.getData('speed');
			if (image.x + image.displayWidth < 0) {
				image.setData('speed', Math.abs(image.getData('speed')));
				image.setFlipX(false);
				image.setY(Phaser.Math.FloatBetween(0, this.gameHeight));
			}
			if (image.x - image.displayWidth > this.gameWidth) {
				image.setData('speed', -Math.abs(image.getData('speed')));
				image.setFlipX(true);
				image.setY(Phaser.Math.FloatBetween(0, this.gameHeight));
			}
		});
	}

	private createBackgroundShips() {
		this.backgroundShips.clear(true, true);
		for (let i = 0; i < 25; i++) {
			const texture = this.textures.addCanvas(null, generateMenuShip(), true);
			const image = this.add.image(Phaser.Math.FloatBetween(-200, this.gameWidth + 200), Phaser.Math.FloatBetween(0, this.gameHeight), texture);
			const direction = Phaser.Math.Between(0, 1) == 0;
			const scale = Phaser.Math.FloatBetween(0.5, 1.5);
			image.setDisplaySize(30 * scale, 30 * scale);
			image.setFlipX(direction);

			image.setData('speed', 0.5 * Phaser.Math.FloatBetween(0.2, 0.6) * scale * (direction ? -1 : 1));

			this.backgroundShips.add(image);
		}
	}
}
