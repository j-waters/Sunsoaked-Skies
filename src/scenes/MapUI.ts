import BaseUI from './BaseUI';
import ShipState from '../states/ShipState';
import Button from '../sprites/ui/Button';
import MapActionButton from '../sprites/ui/MapActionButton';
import type WorldMap from './WorldMap';

export default class MapUI extends BaseUI {
	private selectedAction: MapActionButton;
	mapScene: WorldMap;

	create() {
		const mapButton = new Button(this, this.gameWidth - 100, this.gameHeight - 100, 200, 'ui/ship');
		mapButton.setOnClick(() => {
			this.state.start(ShipState);
		});
		this.add.existing(mapButton);

		this.ship.weapons.forEach((weapon) => {
			const button = new MapActionButton(this, 200, this.gameHeight - 100, 200, weapon, 1);
			this.add.existing(button);
		});
	}

	get ship() {
		return this.dataStore.playerShip;
	}

	select(action: MapActionButton) {
		this.selectedAction?.deselect();
		this.selectedAction = action;
		this.mapScene.selectAction(action.weapon);
	}

	deselect() {
		this.selectedAction?.deselect();
		this.mapScene.deselectAction();
	}
}
