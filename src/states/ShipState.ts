import State from './StateManager';
import { Background } from '../scenes/Background';
import ShipHull from '../scenes/ShipHull';
import Ship from '../models/Ship';
import Helm from '../models/rooms/Helm';
import Quarters from '../models/rooms/Quarters';
import Person from '../models/Person';
import Gunnery from '../models/rooms/Gunnery';
import Storage from '../models/rooms/Storage';
import Engine from '../models/rooms/Engine';
import Empty from '../models/rooms/Empty';
import ShipUI from '../scenes/ShipUI';
import MapState from './MapState';

export default class ShipState extends State {
	private uiScene: ShipUI;
	private shipScene: ShipHull;
	private background: Phaser.Scene;

	initScenes() {
		this.background = this.scene.add('background', Background);
		this.shipScene = <ShipHull>this.scene.add('ship', ShipHull);
		this.uiScene = <ShipUI>this.scene.add('ship_ui', ShipUI);
	}

	getScenes() {
		this.background = this.scene.getScene('background');
		this.shipScene = <ShipHull>this.scene.getScene('ship');
		this.uiScene = <ShipUI>this.scene.getScene('ship_ui');
	}

	start(previousState) {
		this.scene.run('background');
		this.scene.run('ship', { ship: this.dataStore.playerShip });
		this.scene.run('ship_ui');
		this.getScenes();

		if (!(previousState instanceof MapState)) {
			this.panIn();
		}

		this.shipBob();
	}

	panIn() {
		const duration = 2000;
		this.shipScene.cameras.main.setZoom(0.5);
		this.shipScene.tweens.add({
			targets: this.shipScene.cameras.main,
			x: {
				from: -this.shipScene.gameWidth,
				to: 0,
				ease: 'Quad.easeInOut',
			},
			zoom: {
				from: 0.5,
				to: 0.8,
				ease: 'Quart.easeIn',
			},
			duration: duration,
		});

		this.uiScene.cameras.main.setZoom(1.2);
		this.uiScene.cameras.main.zoomTo(1, 350, 'Quad.easeOut');
		this.uiScene.tweens.add({
			targets: this.uiScene.cameras.main,
			alpha: {
				from: 0,
				to: 1,
			},
			duration: duration,
			ease: 'Quad.easeOut',
		});
	}

	shipBob() {
		this.uiScene.tweens.add({
			targets: this.shipScene.cameras.main,
			y: '+=15',
			duration: 8000,
			repeat: -1,
			yoyo: true,
			ease: 'Cubic.easeInOut',
		});
	}

	end(newState) {
		console.log('end');
		this.scene.sleep('ship');
		this.scene.sleep('ship_ui');
		this.scene.sleep('background');
	}
}
