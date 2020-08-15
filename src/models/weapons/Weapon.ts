import Scene = Phaser.Scene;
import { WeaponRangeOverlay, WeaponTargetOverlay } from '../../sprites/map/WeaponOverlay';
import type MapAction from '../MapAction';
import type { SceneBase } from '../../scenes/SceneBase';

export default abstract class Weapon implements MapAction {
	cooldownTime: number;
	cooldown: number;
	icon: string;
	selected = false;
	angle: number;
	range: number;
	spread: number;
	speed: number;

	getWeaponRangeOverlay(scene: Scene) {
		return new WeaponRangeOverlay(scene, this);
	}

	getWeaponTargetOverlay(scene: SceneBase) {
		return new WeaponTargetOverlay(scene, this);
	}

	getWeaponProjectileTexture(scene: Scene) {
		if (scene.textures.exists('projectile/ball')) {
			return scene.textures.get('projectile/ball');
		}
		return scene.textures.addCanvas('projectile/ball', generate());
	}
}

function generate() {
	const canvas = document.createElement('canvas');

	canvas.width = 20;
	canvas.height = 20;
	const context = canvas.getContext('2d');

	context.fillStyle = '#000000';
	context.ellipse(10, 10, 10, 10, 0, 0, Math.PI * 2);
	context.fill();
	return canvas;
}
