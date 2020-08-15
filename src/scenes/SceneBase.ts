import { StateManager } from '../states/StateManager';
import DataStore from '../DataStore';
import Vector2 = Phaser.Math.Vector2;

export abstract class SceneBase extends Phaser.Scene {
	state: StateManager;
	_debug: Debug;

	protected constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
		super(config);
		this.state = StateManager.create();
	}
	public get gameWidth(): number {
		return this.scale.width as number;
	}

	public get gameHeight(): number {
		return this.scale.height as number;
	}

	protected setView(): void {
		// focus on center
		this.cameras.main.centerOn(0, 0);
	}

	get dataStore() {
		return DataStore.create();
	}

	get Debug() {
		if (!this._debug) {
			this._debug = new Debug(this);
			this.add.existing(this._debug);
		}
		return this._debug;
	}

	update(time: number, delta: number): void {
		super.update(time, delta);
		this._debug?.update();
	}
}

class Debug extends Phaser.GameObjects.Graphics {
	private texts: Phaser.GameObjects.Text[];
	constructor(scene: SceneBase) {
		super(scene);
		this.lineStyle(1, 0xffff00);
		this.texts = [];
	}

	update() {
		this.clear();
		this.texts.forEach((t) => t.destroy());
		this.texts = [];
	}

	addLine(p1: Vector2, p2: Vector2) {
		this.lineBetween(p1.x, p1.y, p2.x, p2.y);
		this.stroke();
	}

	addAngle(centre: Vector2, angle: number, text?: boolean) {
		let other = new Vector2(100, 0).setAngle(angle).add(centre);
		this.lineBetween(centre.x, centre.y, other.x, other.y);
		this.stroke();
		if (text) this.addText(other, angle.toString());
	}

	addText(position: Vector2, text: string) {
		let t = new Phaser.GameObjects.Text(this.scene, position.x, position.y, text, { fontFamily: 'Arial' });
		this.texts.push(t);
		this.scene.add.existing(t);
	}
}
