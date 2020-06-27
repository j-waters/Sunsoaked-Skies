import { SceneBase } from "./SceneBase";

export class Preloader extends SceneBase {
	constructor() {
		super("Preloader");
	}
	public preload(): void {
		console.log("Preloader");

		this.load.image("menu/hill", "assets/menu/hill.png");
	}

	public create() {
		this.scene.start("Menu");
	}
}
