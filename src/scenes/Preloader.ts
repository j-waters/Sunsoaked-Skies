import { SceneBase } from './SceneBase';
import WebFontFile from '../loaders/WebFontFile';

export class Preloader extends SceneBase {
	constructor() {
		super('Preloader');
	}
	public preload(): void {
		console.log('Preloader');

		this.load.image('menu/hill', 'assets/menu/hill.png');
		//
		this.load.addFile(new WebFontFile(this.load, ['Artifika']));
	}

	public create() {
		this.scene.start('ShipScene');
	}
}
