import type Weapon from '../../models/weapons/Weapon';
import Color = Phaser.Display.Color;
import type MapShipSprite from './MapShipSprite';
import Segment from '../Segment';
import Vector2 = Phaser.Math.Vector2;
import type { SceneBase } from '../../scenes/SceneBase';

export class WeaponRangeOverlay extends Segment {
	private weapon: Weapon;

	constructor(scene: Phaser.Scene, weapon: Weapon) {
		super(scene, weapon.angle, weapon.range, Color.ValueToColor('rgb(137,30,64)'), 0.1, true);
		this.weapon = weapon;
	}

	setTo(playerShip: MapShipSprite) {
		this.setPosition(playerShip.x, playerShip.y);
		this.setRotation(playerShip.rotation - Phaser.Math.DegToRad(this.weapon.angle) / 2);
	}
}

export class WeaponTargetOverlay extends Segment {
	private weapon: Weapon;
	public targetAngle: number;

	constructor(scene: SceneBase, weapon: Weapon) {
		super(scene, weapon.spread, weapon.range, Color.ValueToColor('rgb(137,30,64)'), 0.3, false);
		this.weapon = weapon;
	}

	setTo(playerShip: MapShipSprite, pointerPosition: Vector2) {
		this.setPosition(playerShip.x, playerShip.y);
		let shipAngle = Phaser.Math.Angle.Normalize(Math.PI / 2);
		let angle = Phaser.Math.Angle.Normalize(
			Phaser.Math.Angle.BetweenPoints(playerShip.ship.position, pointerPosition) - Phaser.Math.DegToRad(this.weapon.spread) / 2 - playerShip.rotation,
		);
		let startAllowedAngle = Phaser.Math.Angle.Normalize(-Phaser.Math.DegToRad(this.weapon.angle) / 2);
		let endAllowedAngle = Phaser.Math.Angle.Normalize(+Phaser.Math.DegToRad(this.weapon.angle) / 2 - Phaser.Math.DegToRad(this.weapon.spread));
		let mirroredStartAngle = Phaser.Math.Angle.Normalize(startAllowedAngle - Math.PI);
		let mirroredEndAngle = Phaser.Math.Angle.Normalize(endAllowedAngle - Math.PI);
		if (angle < startAllowedAngle && angle > Phaser.Math.Angle.Normalize(shipAngle - Math.PI)) {
			angle = startAllowedAngle;
		} else if (angle > endAllowedAngle && angle < shipAngle) {
			angle = endAllowedAngle;
		} else if (angle < mirroredStartAngle && angle > shipAngle) {
			angle = mirroredStartAngle;
		} else if (angle > mirroredEndAngle && angle < Phaser.Math.Angle.Normalize(shipAngle - Math.PI)) {
			angle = mirroredEndAngle;
		}
		angle = Phaser.Math.Angle.Normalize(angle + playerShip.rotation);
		this.setRotation(angle);
		this.targetAngle = angle + Phaser.Math.DegToRad(this.weapon.spread * weightedRandom());
	}
}

function weightedRandom() {
	return 1 - Math.pow(1 - 2 * Phaser.Math.RND.frac(), 2);
}
