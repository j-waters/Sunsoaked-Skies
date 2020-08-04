import { SceneBase } from './SceneBase';

export default abstract class BaseUI extends SceneBase {
	abstract largeButton: {
		texture: string;
		action: () => void;
	};
	create() {
		this.createLargeButton();
	}

	private createLargeButton() {
		let bg = this.add.rectangle(this.gameWidth + 2.5, this.gameHeight + 2.5, 200, 200);
		bg.setOrigin(1, 1);
		bg.setStrokeStyle(5, 0x6b4a31);
		bg.setFillStyle(0xecb07f);
		bg.setInteractive({
			useHandCursor: true,
		});
		let compass = this.add.image(this.gameWidth - 25, this.gameHeight - 25, this.largeButton.texture);
		compass.setOrigin(1, 1);
		compass.setDisplaySize(150, 150);
		compass.setTint(0xf5ce42);
		bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.largeButton.action();
		});
	}
}
