import Scene = Phaser.Scene;
import Curve = Phaser.Curves.Curve;
import type Ship from '../../models/Ship';

export default class GraphicOverlay extends Phaser.GameObjects.Graphics {
	constructor(scene: Scene) {
		super(scene);
	}

	drawProspectiveMovement(curve: Curve) {
		this.lineStyle(1, 0x000000, 0.5);
		curve.draw(this);
	}

	drawCurrentMovement(ship: Ship) {
		let lineAlpha = 1;
		if (ship.movementProgress > 0.8) {
			lineAlpha *= (1 - ship.movementProgress) / 0.2;
		}
		this.lineStyle(1, 0x000000, lineAlpha);
		ship.targetCurve?.draw(this);
	}
}
