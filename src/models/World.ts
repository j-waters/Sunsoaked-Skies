import type { Location } from './Location';
import { generateSeed, generateWorldTexture, generateLocations } from '../generation/generateWorld';
import Scene = Phaser.Scene;

console.log('');

export type WorldType = 'ISLANDS' | 'CONTINENT';

export default class World {
	worldType: WorldType;
	seed: any;
	private _locations: Location[];
	size: number = 512 * 1.5;

	constructor(worldType: WorldType, seed: any) {
		this.worldType = worldType;
		this.seed = seed;
	}

	generateTexture(scene: Scene, size: number = 512) {
		return generateWorldTexture(scene, this, size);
	}

	get locations() {
		this._locations = this._locations ?? generateLocations(this);
		return this._locations;
	}

	static generate(worldType: WorldType = 'ISLANDS') {
		return new World(worldType, generateSeed());
	}
}
