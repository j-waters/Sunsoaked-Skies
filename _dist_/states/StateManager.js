import DataStore2 from "../DataStore.js";
export class StateManager {
  constructor() {
    this.initialised = new Set();
  }
  static create() {
    if (!this.instance) {
      this.instance = new StateManager();
    }
    return this.instance;
  }
  start(stateClass) {
    let old = this.current;
    this.current = new stateClass(StateManager.sceneManager);
    old?.end(this.current);
    if (!this.initialised.has(stateClass)) {
      this.current.initScenes();
      this.initialised.add(stateClass);
    }
    this.current.start(old);
  }
}
export default class State {
  constructor(scene) {
    this.scene = scene;
  }
  get state() {
    return StateManager.create();
  }
  get dataStore() {
    return DataStore2.create();
  }
}
