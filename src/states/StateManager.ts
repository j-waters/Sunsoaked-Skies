import DataStore from '../DataStore';
import MapState from './MapState';
import ShipState from './ShipState';

type StateConstructor = new (scenes: Phaser.Scenes.SceneManager) => State;

// export interface StateTransition {
// 	old: StateConstructor;
// 	new: StateConstructor;
// 	outIn: boolean;
// }
//
// const STATE_TRANSITIONS: StateTransition[] = [
// 	{
// 		old: MapState,
// 		new: ShipState,
// 		outIn: false
// 	}
// ]

export class StateManager {
	static instance: StateManager;
	static sceneManager: Phaser.Scenes.SceneManager;
	initialised: Set<StateConstructor> = new Set();

	current: State;

	private constructor() {}

	static create() {
		if (!this.instance) {
			this.instance = new StateManager();
		}
		return this.instance;
	}

	start(stateClass: StateConstructor) {
		let state = new stateClass(StateManager.sceneManager);
		this.current?.end(state);
		if (!this.initialised.has(stateClass)) {
			state.initScenes();
			this.initialised.add(stateClass);
		}
		state.start(this.current);
		this.current = state;
	}
}

export default abstract class State {
	protected scene: Phaser.Scenes.SceneManager;

	constructor(scene: Phaser.Scenes.SceneManager) {
		this.scene = scene;
	}

	abstract initScenes();

	abstract getScenes();

	get state() {
		return StateManager.create();
	}

	abstract start(previousState: State);

	abstract end(nextState: State);

	get dataStore() {
		return DataStore.create();
	}
}
