import { SceneBase } from './SceneBase';
import WebFontFile from '../loaders/WebFontFile';
import ShipState from '../states/ShipState';
import MapState from '../states/MapState';
import OutlinePipeline from '../shaders/OutlinePipeline';
import NewGameState from '../states/NewGameState';

export class Preloader extends SceneBase {
	static key = 'Preloader';
	constructor() {
		super(Preloader.key);
	}
	public preload(): void {
		this.load.image('menu/hill', 'assets/images/menu/hill.png');
		this.load.svg('ui/compass', 'assets/images/ui/compass.svg', { width: 512, height: 512 });
		this.load.svg('map/ruin', 'assets/images/map/ruin.svg', { width: 512, height: 512 });
		this.load.svg('map/move-target', 'assets/images/map/move-target.svg', { width: 512, height: 512 });

		this.load.addFile(new WebFontFile(this.load, ['Artifika']));
	}

	public create() {
		// this.state.start(ShipState);
		this.state.start(NewGameState);
	}
}
