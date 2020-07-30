import { SceneBase } from './SceneBase';

export default class ShipUI extends SceneBase {
	create() {
		this.createMapButton();
	}

	private createMapButton() {
		let bg = this.add.rectangle(this.gameWidth + 2.5, this.gameHeight + 2.5, 200, 200);
		bg.setOrigin(1, 1);
		bg.setStrokeStyle(5, 0x6b4a31);
		bg.setFillStyle(0xecb07f);
		bg.setInteractive({
			useHandCursor: true,
		});
		let compass = this.add.image(this.gameWidth - 25, this.gameHeight - 25, 'ui/compass');
		compass.setOrigin(1, 1);
		compass.setDisplaySize(150, 150);
		compass.setTint(0xf5ce42);
	}
}
