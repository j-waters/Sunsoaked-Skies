import DataStore from '../DataStore';

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
		const old = this.current;
		this.current = new stateClass(StateManager.sceneManager);
		old?.end(this.current);
		if (!this.initialised.has(stateClass)) {
			this.current.initScenes();
			this.initialised.add(stateClass);
		}
		this.current.start(old);
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
