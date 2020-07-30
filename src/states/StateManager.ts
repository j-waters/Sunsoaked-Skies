type StateConstructor = new (scenes: Phaser.Scenes.SceneManager) => State;

export class StateManager {
	static instance: StateManager;
	static sceneManager: Phaser.Scenes.SceneManager;

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
		state.start(this.current);
		this.current = state;
	}
}

export default abstract class State {
	protected scene: Phaser.Scenes.SceneManager;

	constructor(scene: Phaser.Scenes.SceneManager) {
		this.scene = scene;
	}

	abstract start(previousState: State);

	abstract end(nextState: State);
}
