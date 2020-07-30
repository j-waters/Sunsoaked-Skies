import { SceneBase } from './SceneBase';
import { Background } from './Background';
import { Preloader } from './Preloader';

export class Boot extends SceneBase {
	constructor() {
		super('Boot');
	}
	public create(): void {
		this.scene.start(Preloader.name);
	}
}
