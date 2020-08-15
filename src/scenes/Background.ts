import { SceneBase } from './SceneBase';

export class Background extends SceneBase {
	constructor() {
		super('background');
	}

	preload() {}

	create() {
		const background = this.add.image(0, 0, this.generateTexture());
		background.setOrigin(0, 0);
	}

	update() {}

	private generateTexture() {
		if (this.textures.exists('gradient_background')) {
			return this.textures.get('gradient_background');
		}
		const texture = this.textures.createCanvas('gradient_background', this.gameWidth, this.gameHeight);
		const context = texture.getContext();
		const grd = context.createLinearGradient(0, 0, 0, this.gameHeight);

		grd.addColorStop(0, '#DEB2FF');
		grd.addColorStop(0.5, '#FFB2BF');
		grd.addColorStop(1, '#FFE9B2');

		context.fillStyle = grd;
		context.fillRect(0, 0, this.gameWidth, this.gameHeight);

		//  Call this if running under WebGL, or you'll see nothing change
		texture.refresh();

		return texture;
	}
}
