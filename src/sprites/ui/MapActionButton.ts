import Button from './Button';
import type Weapon from '../../models/weapons/Weapon';
import type MapUI from '../../scenes/MapUI';
import Color = Phaser.Display.Color;

export default class MapActionButton extends Button {
	weapon: Weapon;
	private num: number;
	private parent: MapUI;

	constructor(parent: MapUI, x, y, size, weapon: Weapon, num: number) {
		super(parent, x, y, size, weapon.icon);

		this.parent = parent;

		this.weapon = weapon;
		this.num = num;

		const key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);

		key.on('down', (key, event) => this.onClick());

		this.setOnClick(() => this.toggle());
	}

	toggle() {
		if (this.weapon.selected) {
			this.parent.deselect();
		} else {
			this.select();
		}
	}

	select() {
		this.parent.select(this);
		this.weapon.selected = true;
		const hoverColour = Color.ValueToColor('rgb(210,0,49)').color;
		this.background.setStrokeStyle(this.lineWidth, hoverColour);
		this.icon.setTint(hoverColour);
	}

	deselect() {
		this.weapon.selected = false;
		this.setNormal();
	}
}
