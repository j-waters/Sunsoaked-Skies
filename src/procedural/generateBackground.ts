import { SceneBase } from "../scenes/SceneBase";

export function createBackground(scene: SceneBase) {
	let texture = scene.textures.createCanvas("gradient_background", scene.gameWidth, scene.gameHeight);
	let context = texture.getContext();
	let grd = context.createLinearGradient(0, 0, 0, scene.gameHeight);

	grd.addColorStop(0, "#DEB2FF");
	grd.addColorStop(0.5, "#FFB2BF");
	grd.addColorStop(1, "#FFE9B2");

	context.fillStyle = grd;
	context.fillRect(0, 0, scene.gameWidth, scene.gameHeight);

	//  Call this if running under WebGL, or you'll see nothing change
	texture.refresh();

	return texture;
}
