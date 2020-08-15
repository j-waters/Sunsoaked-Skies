import BaseUI from './BaseUI';
import MapState from '../states/MapState';
import Button from '../sprites/ui/Button';

export default class ShipUI extends BaseUI {
	create() {
		const mapButton = new Button(this, this.gameWidth - 100, this.gameHeight - 100, 200, 'ui/compass');
		mapButton.setOnClick(() => {
			this.state.start(MapState);
		});
		this.add.existing(mapButton);
	}
}
