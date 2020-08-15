import type WorldMap from '../../scenes/WorldMap';
import type MapAction from '../../models/MapAction';
import { MovementAction } from '../../models/MapAction';
import Weapon from '../../models/weapons/Weapon';
import Color = Phaser.Display.Color;

export default class Cursor extends Phaser.GameObjects.Image {
	private parent: WorldMap;
	private tween: Phaser.Tweens.Tween;
	constructor(parent: WorldMap) {
		super(parent, 0, 0, null);
		this.parent = parent;
	}

	selectAction(action: MapAction) {
		if (action instanceof MovementAction) {
			this.tween?.stop();
			this.movementAction();
		} else if (action instanceof Weapon) {
			this.weaponAction();
		}
	}

	private movementAction() {
		const texture = this.parent.dataStore.playerShip.generateTopDownTexture(this.parent);
		// @ts-ignore
		this.setTexture(texture);
		this.setDisplaySize(5 * 2.5, 8 * 2.5);
		this.setAlpha(0.5);
		this.clearTint();
	}

	private weaponAction() {
		this.setTexture('map/target');
		this.setDisplaySize(20, 20);
		this.setTint(Color.ValueToColor('rgb(0, 0, 0)').color);
		this.setAlpha(0.5);
		this.tween = this.parent.add.tween({
			targets: this,
			rotation: {
				from: 0,
				to: 2 * Math.PI,
				duration: 6000,
			},
			scale: {
				from: this.scale * 0.9,
				to: this.scale * 1.1,
				yoyo: true,
				duration: 3000,
			},
			loop: -1,
		});
	}
}
