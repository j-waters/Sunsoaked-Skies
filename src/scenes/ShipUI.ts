import { SceneBase } from './SceneBase';
import BaseUI from './BaseUI';
import MapState from '../states/MapState';

export default class ShipUI extends BaseUI {
	largeButton = {
		texture: 'ui/compass',
		action: () => {
			this.state.start(MapState);
		},
	};

	create() {
		super.create();
	}
}
