import type Ship from './models/Ship';
import type World from './models/World';

export default class DataStore {
	private static instance: DataStore;
	playerShip: Ship;
	worlds: World[];
	private constructor() {
		this.worlds = [];
	}

	static create() {
		if (!this.instance) {
			this.instance = new DataStore();
		}
		return this.instance;
	}
}
