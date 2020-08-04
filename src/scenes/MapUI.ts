import { SceneBase } from './SceneBase';
import BaseUI from './BaseUI';
import MapState from '../states/MapState';
import ShipState from '../states/ShipState';

export default class MapUI extends BaseUI {
	largeButton = {
		texture: 'ui/compass',
		action: () => {
			this.state.start(ShipState);
		},
	};

	create() {
		super.create();
	}
}
