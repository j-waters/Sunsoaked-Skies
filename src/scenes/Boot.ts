import { SceneBase } from "./SceneBase";

export class Boot extends SceneBase {
	constructor() {
		super("Boot");
	}
	public create(): void {
		console.log("Boot");

		this.scene.start("Preloader");
	}
}
