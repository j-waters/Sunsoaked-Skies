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

export default class ShipState extends State {
	private uiScene: ShipUI;
	private shipScene: ShipHull;
	start(previousState) {
		let builder = Ship.builder();

		let r1 = builder
			.createRootRoom(new Helm(1, 1, false)) //
			.addRoomDown(new Quarters(1, 2))
			.addPerson(new Person())
			.addPerson(new Person());

		r1.addRoomRight(new Gunnery(3, 1)).addPerson(new Person()).addPerson(new Person());

		r1.addRoomRight(new Storage(2, 1), [0, 1]).addPerson(new Person());
		r1.addRoomDown(new Engine(1, 1)).addPerson(new Person()).addRoomRight(new Empty(1, 1));
		let ship = builder.build();

		let background = this.scene.add('background', Background, true);
		this.shipScene = <ShipHull>this.scene.add('ship', ShipHull, true, { ship });

		this.uiScene = <ShipUI>this.scene.add('ship_ui', ShipUI, true);

		this.panIn();

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

	end(newState) {}
}
