import Scene = Phaser.Scene;
import Rectangle = Phaser.GameObjects.Rectangle;
import Image = Phaser.GameObjects.Image;
import Color = Phaser.Display.Color;

export default class Button extends Phaser.GameObjects.Container {
	protected background: Phaser.GameObjects.Rectangle;
	protected icon: Phaser.GameObjects.Image;
	protected onClick: () => void;
	constructor(scene: Scene, x, y, size, icon: string) {
		super(scene, x, y);

		this.background = new Rectangle(scene, 0, 0, 200, 200);
		this.add(this.background);

		this.icon = new Image(scene, 0, 0, icon);
		this.icon.setDisplaySize(150, 150);
		this.add(this.icon);

		this.setNormal();

		this.setSize(this.background.width, this.background.height);

		this.setInteractive({
			useHandCursor: true,
		});

		this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onClick());

		this.on(Phaser.Input.Events.POINTER_OVER, () => this.setHover());

		this.on(Phaser.Input.Events.POINTER_OUT, () => this.setNormal());
	}

	setNormal() {
		this.background.setStrokeStyle(this.lineWidth, Color.ValueToColor('rgb(107, 74, 49)').color);
		this.background.setFillStyle(Color.ValueToColor('rgb(236, 176, 127)').color);
		this.icon.setTint(Color.ValueToColor('rgb(69,57,25)').color);
	}

	setHover() {
		this.icon.setTint(Color.ValueToColor('rgb(245, 206, 66)').color);
	}

	get lineWidth() {
		return 5;
	}

	setOnClick(func: () => void) {
		this.onClick = func;
	}
}
