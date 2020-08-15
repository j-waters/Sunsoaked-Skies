import Graphics = Phaser.GameObjects.Graphics;
import Scene = Phaser.Scene;
import Color = Phaser.Display.Color;

export default class Segment extends Graphics {
	constructor(scene: Scene, angle: number, radius: number, colour: Color, alpha?: number, mirror?: boolean) {
		super(scene);
		this.moveTo(0, 0);
		this.arc(0, 0, radius, 0, Phaser.Math.DegToRad(angle));
		if (mirror) {
			this.lineTo(0, 0);
			this.arc(0, 0, radius, Math.PI, Phaser.Math.DegToRad(angle) + Math.PI);
		}
		this.fillStyle(colour.color, alpha || 1);
		this.fill();
	}
}
