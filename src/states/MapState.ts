import State from './StateManager';
import WorldMap from '../scenes/WorldMap';
import MapUI from '../scenes/MapUI';

export default class MapState extends State {
	private uiScene: MapUI;
	private mapScene: WorldMap;
	start(previousState: State) {
		this.scene.run('map', { world: this.dataStore.playerShip.world });
		this.scene.run('map_ui');
		this.getScenes();
	}

	end(nextState: State) {
		this.scene.sleep('map');
		this.scene.sleep('map_ui');
	}

	initScenes() {
		this.mapScene = <WorldMap>this.scene.add('map', WorldMap);
		this.uiScene = <MapUI>this.scene.add('map_ui', MapUI);
	}

	getScenes() {
		this.mapScene = <WorldMap>this.scene.getScene('map');
		this.uiScene = <MapUI>this.scene.getScene('map_ui');
		this.uiScene.mapScene = this.mapScene;
	}
}
