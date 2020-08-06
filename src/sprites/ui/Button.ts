import Scene = Phaser.Scene;
import Rectangle = Phaser.GameObjects.Rectangle;
import Image = Phaser.GameObjects.Image;

export default class Button extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Rectangle;
	private icon: Phaser.GameObjects.Image;
	private onClick: () => void;
	constructor(scene: Scene, x, y, size, icon: string) {
		super(scene, x, y);

		this.background = new Rectangle(scene, 0, 0, 200, 200);
		this.background.setStrokeStyle(5, 0x6b4a31);
		this.background.setFillStyle(0xecb07f);
		this.add(this.background);

		this.icon = new Image(scene, 0, 0, icon);
		this.icon.setDisplaySize(150, 150);
		this.icon.setTint(0xf5ce42);
		this.add(this.icon);

		this.setSize(this.background.width, this.background.height);

		this.setInteractive({
			useHandCursor: true,
		});

		this.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.onClick();
		});
	}

	setOnClick(func: () => void) {
		this.onClick = func;
	}
}
