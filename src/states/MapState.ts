import State from './StateManager';
import { generateWorld } from '../generation/generateWorld';
import WorldMap from '../scenes/WorldMap';
import WorldMapTester from '../scenes/WorldMapTester';

export default class MapState extends State {
	start(previousState: State) {
		let world = generateWorld();
		this.scene.add('map', WorldMapTester, true, { world: world });
	}

	end(nextState: State) {}
}
