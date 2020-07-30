import type Location from './Location';

export type WorldType = 'ISLANDS' | 'CONTINENT';

export default class World {
	worldType: WorldType;
	seed: any;

	constructor(worldType: WorldType, seed: any) {
		this.worldType = worldType;
		this.seed = seed;
	}
}
