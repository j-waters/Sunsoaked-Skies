import { SceneBase } from './SceneBase';
import BaseUI from './BaseUI';
import MapState from '../states/MapState';
import ShipState from '../states/ShipState';
import Button from '../sprites/ui/Button';
import ShipUI from './ShipUI';

export default class MapUI extends BaseUI {
	create() {
		let mapButton = new Button(this, this.gameWidth - 100, this.gameHeight - 100, 200, 'ui/compass');
		mapButton.setOnClick(() => {
			this.state.start(ShipState);
		});
		this.add.existing(mapButton);
	}
}
