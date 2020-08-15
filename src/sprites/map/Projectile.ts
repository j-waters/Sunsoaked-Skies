import Scene = Phaser.Scene;
import type Weapon from '../../models/weapons/Weapon';
import Vector2 = Phaser.Math.Vector2;

const SPEED_DROPOFF = 0.8;
const ALPHA_DROPOFF = 0.95;

export default class Projectile extends Phaser.GameObjects.Image {
	velocity: Vector2;
	distance: number;
	private weapon: Weapon;
	private size: number;
	constructor(scene: Scene, weapon: Weapon, startPosition: Vector2, angle) {
		super(scene, startPosition.x, startPosition.y, weapon.getWeaponProjectileTexture(scene));
		this.velocity = new Vector2(weapon.speed, 0).setAngle(angle);
		this.size = 3;
		this.setDisplaySize(this.size, this.size);
		this.distance = 0;
		this.weapon = weapon;
	}

	update() {
		this.setPosition(this.x + this.velocity.x, this.y + this.velocity.y);
		this.distance += this.velocity.length();
		let progress = this.distance / this.weapon.range;
		if (progress > ALPHA_DROPOFF) {
			this.setAlpha((1 - progress) / (1 - ALPHA_DROPOFF));
			this.setDisplaySize((this.size * (1 - progress)) / (1 - ALPHA_DROPOFF), (this.size * (1 - progress)) / (1 - ALPHA_DROPOFF));
		}

		if (progress > SPEED_DROPOFF) {
			this.velocity.setLength(this.velocity.length() - this.deceleration);
		}

		if (progress >= 1) {
			this.destroy();
		}
	}

	get deceleration() {
		return Math.pow(this.weapon.speed, 2) / (2 * this.weapon.range * (1 - SPEED_DROPOFF));
	}
}
