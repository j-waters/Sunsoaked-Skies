import type World from '../models/World';
import type { WorldType } from '../models/World';
import SimplexNoise from 'simplex-noise';
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;
import Location from '../models/Location';
import Vector2 = Phaser.Math.Vector2;

console.log('');
export const worldTypes: { [key in WorldType]: WorldGenerationSettings } = {
	ISLANDS: {
		zoom: 130,
		threshold: 0.5,
		exp: 1.5,
		gradientZoom: 1.5,
		elev2proportion: 0.8,
		elevationMod: 1.7,
	},
	CONTINENT: null,
};

export interface WorldGenerationSettings {
	zoom: number;
	threshold: number;
	gradientZoom: number;
	exp: number;
	elev2proportion: number;
	elevationMod: number;
}

interface Biome {
	temperature: number;
	moisture: number;
	colour: string;
	nonSolid?: boolean;
}

const asBiomes = <T>(b: { [K in keyof T]: Biome }) => b;

const biomes = asBiomes({
	SNOW: {
		temperature: 0b001,
		moisture: 0b1000,
		colour: 'rgb(255,255,255)',
	},
	SNOWY_CONIFEROUS_FOREST: {
		temperature: 0b001,
		moisture: 0b0100,
		colour: 'rgb(255,255,255)',
	},
	CONIFEROUS_FOREST: {
		temperature: 0b001,
		moisture: 0b0010,
		colour: 'rgb(21,62,1)',
	},
	TUNDRA: {
		temperature: 0b001,
		moisture: 0b0001,
		colour: 'rgb(132,121,109)',
	},

	FOREST: {
		temperature: 0b010,
		moisture: 0b1000,
		colour: 'rgb(41,177,43)',
	},
	PLAINS: {
		temperature: 0b110,
		moisture: 0b0100,
		colour: 'rgb(93,201,95)',
	},
	SHRUBLAND: {
		temperature: 0b010,
		moisture: 0b0010,
		colour: 'rgb(157,170,81)',
	},

	TROPICAL_FOREST: {
		temperature: 0b100,
		moisture: 0b1000,
		colour: 'rgb(98,206,43)',
	},
	GRASSLAND: {
		temperature: 0b100,
		moisture: 0b0010,
		colour: 'rgb(190,198,82)',
	},
	DESSERT: {
		temperature: 0b110,
		moisture: 0b0001,
		colour: 'rgb(246,238,160)',
	},

	BEACH: {
		temperature: 0b000,
		moisture: 0b0000,
		colour: 'rgb(255,241,143)',
	},
	WATER: {
		temperature: 0b000,
		moisture: 0b0000,
		colour: 'rgb(63,161,213)',
		nonSolid: true,
	},
	DEEP_WATER: {
		temperature: 0b000,
		moisture: 0b0000,
		colour: 'rgb(48,144,196)',
		nonSolid: true,
	},
	BARE: {
		temperature: 0b000,
		moisture: 0b0000,
		colour: 'rgb(101,101,101)',
	},
	HILLS: {
		temperature: 0b000,
		moisture: 0b0000,
		colour: 'rgb(34,153,36)',
	},
});

type BiomeName = keyof typeof biomes;

export function generateSeed() {
	return Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join('');
}

export function generateLocations(world: World) {
	let worldGenerator = new WorldGenerator(world, 512);
	let locations: Location[] = [];
	let tries = 0;
	while (locations.length < 15) {
		let skip = false;
		let point = worldGenerator.randomPoint();
		if (!point.details.biome.nonSolid) {
			for (const location of locations) {
				if (Phaser.Math.Distance.BetweenPoints(location.position, point.position) < 50) {
					tries++;
					skip = true;
					break;
				}
			}
			if (skip) {
				continue;
			}
			locations.push(new Location(point.position, {}));
			tries = 0;
		}
		if (tries > 1000) {
			break;
		}
	}
	return locations;
}

export function generateWorldTexture(scene: Scene, world: World, size: number, gs?: WorldGenerationSettings) {
	if (scene.textures.exists(`_world/${world.seed}/${size}`)) {
		console.log('reusing texture');
		return scene.textures.get(`_world/${world.seed}/${size}`);
	}
	return scene.textures.addCanvas(`_world/${world.seed}/${size}`, generateWorldGraphic(world, size, gs));
}

export function generateWorldGraphic(world: World, textureSize, gs?: WorldGenerationSettings) {
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	let worldGen = new WorldGenerator(world, textureSize, gs);

	canvas.width = worldGen.textureSize * worldGen.tileSize;
	canvas.height = worldGen.textureSize * worldGen.tileSize;

	let div = worldGen.worldSize / worldGen.textureSize;

	for (let x = 0; x < worldGen.textureSize; x++) {
		for (let y = 0; y < worldGen.textureSize; y++) {
			let p = worldGen.getAt(x * div, y * div);
			context.fillStyle = p.biome.colour;
			context.fillRect(x * worldGen.tileSize, y * worldGen.tileSize, worldGen.tileSize, worldGen.tileSize);
		}
	}

	context.fillStyle = 'red';

	// generateLocations(world).forEach((location) => {
	// 	context.fillRect(location.position.x * worldGen.tileSize, location.position.y * worldGen.tileSize, 10, 10);
	// });
	return canvas;
}

class WorldPixel {
	elevation: number;
	temperature: number;
	moisture: number;
	private generator: WorldGenerator;

	constructor(elevation: number, temperature: number, moisture: number, generator: WorldGenerator) {
		this.elevation = elevation;
		this.temperature = temperature;
		this.moisture = moisture;
		this.generator = generator;
	}

	get biomeName(): BiomeName {
		let biome: BiomeName;
		let elevation = this.elevation;

		if (elevation < 0) {
			if (elevation < -0.5) {
				biome = 'DEEP_WATER';
			} else {
				biome = 'WATER';
			}
		} else {
			if (elevation < 0.1) {
				biome = 'BEACH';
			} else if (elevation < 0.6) {
				biome = this.moisture > 0.5 ? 'FOREST' : 'PLAINS';
			} else if (elevation < 0.8) {
				biome = 'HILLS';
			} else if (elevation < 0.95) {
				biome = 'BARE';
			} else {
				biome = 'SNOW';
			}
			let value = Object.values(biomes)
				.filter((biome) => biome.moisture & this.snappedMoisture)
				.find((biome) => biome.temperature & this.snappedTemperature);
			// console.log(
			// 	value,
			// 	this.snappedMoisture,
			// 	this.snappedTemperature,
			// 	this.moisture,
			// 	this.temperature,
			// 	this.snappedMoisture.toString(2),
			// 	this.snappedTemperature.toString(2),
			// );

			// biome = (Object.keys(biomes) as Array<keyof typeof biomes>).find((key) => biomes[key] === value);
		}
		return biome;
	}

	get biome(): Biome {
		return biomes[this.biomeName];
	}

	get snappedTemperature() {
		return Math.pow(2, Math.ceil(this.temperature * 3) - 1);
	}

	get snappedMoisture() {
		return Math.pow(2, Math.ceil(this.moisture * 4) - 1);
	}
}

class WorldGenerator {
	private gs: WorldGenerationSettings;
	private elevationNoise: SimplexNoise;
	private elevationNoise2: SimplexNoise;
	tileSize: number = 2;
	private pointRandom: Phaser.Math.RandomDataGenerator;
	private moistureNoise: SimplexNoise;
	private temperatureNoise: SimplexNoise;
	private world: World;
	textureSize: number;

	constructor(world: World, textureSize: number, gs?: WorldGenerationSettings) {
		this.world = world;
		this.textureSize = textureSize;
		this.gs = gs || worldTypes[this.world.worldType];
		this.elevationNoise = new SimplexNoise(this.seed + 'e1');
		this.elevationNoise2 = new SimplexNoise(this.seed + 'e2');
		this.moistureNoise = new SimplexNoise(this.seed + 'm');
		this.temperatureNoise = new SimplexNoise(this.seed + 't');
		this.pointRandom = new Phaser.Math.RandomDataGenerator(this.seed + 'p');
	}

	get seed() {
		return this.world.seed;
	}

	get worldSize() {
		return this.world.size;
	}

	get zoom() {
		return this.gs.zoom; // * (this.worldSize / 512);
	}

	public getAt(x: number, y: number): WorldPixel {
		// x /= this.worldSize / this.textureSize;
		// y /= this.worldSize / this.textureSize;
		let elevation = this.elevationAt(x, y);
		if (elevation < 0) {
			elevation = 0.01;
		}

		if (elevation < this.threshold) {
			elevation = -elevation / this.threshold;
		} else {
			elevation = (elevation - this.threshold) / (1 - this.threshold);
			elevation *= this.gs.elevationMod;
		}

		return new WorldPixel(elevation, this.temperatureAt(x, y), this.moistureAt(x, y), this);
	}

	get threshold() {
		return this.gs.threshold;
	}

	public randomPoint() {
		let p = new Vector2(this.pointRandom.between(0, this.worldSize), this.pointRandom.between(0, this.worldSize));
		return { position: p, details: this.getAt(p.x, p.y) };
	}

	private gradientAt(x: number, y: number) {
		x = x / this.worldSize;
		y = y / this.worldSize;

		const f = (n) => -(4 * this.gs.gradientZoom) * (n - 1) * n;
		// let intercept = 1 + this.gs.gradientZoom;
		// −37.5 * x^4 + 75x^3 − 50.875x^2 + 13.375x
		let g = f(x) * f(y);
		if (g > 1) g = 1;
		return g;
	}

	private elevationAt(x: number, y: number) {
		let e1 = this.elevationNoise.noise2D(x / this.zoom, y / this.zoom);
		let e2 = this.elevationNoise2.noise2D((x * 2) / this.zoom, (y * 2) / this.zoom);
		let e = normalise((e1 + this.gs.elev2proportion * e2) / (1 + this.gs.elev2proportion));
		e = Math.pow(e, this.gs.exp);
		return e - (1 - this.gradientAt(x, y));
	}

	private moistureAt(x: number, y: number) {
		let m = normalise(this.moistureNoise.noise2D((x / this.zoom) * 2, (y / this.zoom) * 2));

		return m;
	}

	private temperatureAt(x: number, y: number) {
		// let t = normalise(this.temperatureNoise.noise2D(x / this.zoom, y / this.zoom));
		//
		// t -= this.elevationAt(x, y) * 0.5;
		//
		// if (t < 0) {
		// 	t = 0.01;
		// }

		return this.elevationAt(x, y);
	}
}

function normalise(n) {
	if (n > 1) {
		n = 1;
	} else if (n < -1) {
		n = -1;
	}
	return (n + 1) / 2;
}
