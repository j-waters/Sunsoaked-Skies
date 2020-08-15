import { SceneBase } from './SceneBase';
import WebFontFile from '../loaders/WebFontFile';
import NewGameState from '../states/NewGameState';
import StartupState from '../states/StartupState';

export class Preloader extends SceneBase {
	static key = 'Preloader';
	constructor() {
		super(Preloader.key);
	}
	public preload(): void {
		this.load.image('menu/hill', 'assets/images/menu/hill.png');
		this.load.svg('ui/compass', 'assets/images/ui/compass.svg', { width: 512, height: 512 });
		this.load.svg('ui/cannon', 'assets/images/ui/cannon.svg', { width: 512, height: 512 });
		this.load.svg('ui/ship', 'assets/images/ui/ship.svg', { width: 512, height: 512 });
		this.load.svg('map/ruin', 'assets/images/map/ruin.svg', { width: 512, height: 512 });
		this.load.svg('map/village', 'assets/images/map/village.svg', { width: 512, height: 512 });
		this.load.svg('map/target', 'assets/images/map/target.svg', { width: 512, height: 512 });

		this.load.addFile(new WebFontFile(this.load, ['Artifika', 'Elder Magic', 'Elder Magic Shadow']));
	}

	public create() {
		if (import.meta.env.MODE === 'development' && false) {
			this.state.start(NewGameState);
		} else {
			this.state.start(StartupState);
		}
	}
}
