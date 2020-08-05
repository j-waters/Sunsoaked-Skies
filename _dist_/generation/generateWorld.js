import SimplexNoise from "../../web_modules/simplex-noise.js";
var Scene = Phaser.Scene;
var Point = Phaser.Geom.Point;
import Location2 from "../models/Location.js";
var Vector2 = Phaser.Math.Vector2;
console.log("");
export const worldTypes = {
  ISLANDS: {
    zoom: 130,
    threshold: 0.5,
    exp: 1.5,
    gradientZoom: 1.5,
    elev2proportion: 0.8,
    elevationMod: 1.7
  },
  CONTINENT: null
};
const asBiomes = (b) => b;
const biomes = asBiomes({
  SNOW: {
    temperature: 1,
    moisture: 8,
    colour: "rgb(255,255,255)"
  },
  SNOWY_CONIFEROUS_FOREST: {
    temperature: 1,
    moisture: 4,
    colour: "rgb(255,255,255)"
  },
  CONIFEROUS_FOREST: {
    temperature: 1,
    moisture: 2,
    colour: "rgb(21,62,1)"
  },
  TUNDRA: {
    temperature: 1,
    moisture: 1,
    colour: "rgb(132,121,109)"
  },
  FOREST: {
    temperature: 2,
    moisture: 8,
    colour: "rgb(41,177,43)"
  },
  PLAINS: {
    temperature: 6,
    moisture: 4,
    colour: "rgb(93,201,95)"
  },
  SHRUBLAND: {
    temperature: 2,
    moisture: 2,
    colour: "rgb(157,170,81)"
  },
  TROPICAL_FOREST: {
    temperature: 4,
    moisture: 8,
    colour: "rgb(98,206,43)"
  },
  GRASSLAND: {
    temperature: 4,
    moisture: 2,
    colour: "rgb(190,198,82)"
  },
  DESSERT: {
    temperature: 6,
    moisture: 1,
    colour: "rgb(246,238,160)"
  },
  BEACH: {
    temperature: 0,
    moisture: 0,
    colour: "rgb(255,241,143)"
  },
  WATER: {
    temperature: 0,
    moisture: 0,
    colour: "rgb(63,161,213)",
    nonSolid: true
  },
  DEEP_WATER: {
    temperature: 0,
    moisture: 0,
    colour: "rgb(48,144,196)",
    nonSolid: true
  },
  BARE: {
    temperature: 0,
    moisture: 0,
    colour: "rgb(101,101,101)"
  },
  HILLS: {
    temperature: 0,
    moisture: 0,
    colour: "rgb(34,153,36)"
  }
});
export function generateSeed() {
  return Array.from({length: 5}, () => Math.random().toString(36)[2]).join("");
}
export function generateLocations(world) {
  let worldGenerator = new WorldGenerator(world, 512);
  let locations = [];
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
      locations.push(new Location2(point.position, {}));
      tries = 0;
    }
    if (tries > 1e3) {
      break;
    }
  }
  return locations;
}
export function generateWorldTexture(scene, world, size, gs) {
  if (scene.textures.exists(`_world/${world.seed}/${size}`)) {
    console.log("reusing texture");
    return scene.textures.get(`_world/${world.seed}/${size}`);
  }
  return scene.textures.addCanvas(`_world/${world.seed}/${size}`, generateWorldGraphic(world, size, gs));
}
export function generateWorldGraphic(world, textureSize, gs) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
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
  context.fillStyle = "red";
  return canvas;
}
class WorldPixel {
  constructor(elevation, temperature, moisture, generator) {
    this.elevation = elevation;
    this.temperature = temperature;
    this.moisture = moisture;
    this.generator = generator;
  }
  get biomeName() {
    let biome;
    let elevation = this.elevation;
    if (elevation < 0) {
      if (elevation < -0.5) {
        biome = "DEEP_WATER";
      } else {
        biome = "WATER";
      }
    } else {
      if (elevation < 0.1) {
        biome = "BEACH";
      } else if (elevation < 0.6) {
        biome = this.moisture > 0.5 ? "FOREST" : "PLAINS";
      } else if (elevation < 0.8) {
        biome = "HILLS";
      } else if (elevation < 0.95) {
        biome = "BARE";
      } else {
        biome = "SNOW";
      }
      let value = Object.values(biomes).filter((biome2) => biome2.moisture & this.snappedMoisture).find((biome2) => biome2.temperature & this.snappedTemperature);
    }
    return biome;
  }
  get biome() {
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
  constructor(world, textureSize, gs) {
    this.tileSize = 2;
    this.world = world;
    this.textureSize = textureSize;
    this.gs = gs || worldTypes[this.world.worldType];
    this.elevationNoise = new SimplexNoise(this.seed + "e1");
    this.elevationNoise2 = new SimplexNoise(this.seed + "e2");
    this.moistureNoise = new SimplexNoise(this.seed + "m");
    this.temperatureNoise = new SimplexNoise(this.seed + "t");
    this.pointRandom = new Phaser.Math.RandomDataGenerator(this.seed + "p");
  }
  get seed() {
    return this.world.seed;
  }
  get worldSize() {
    return this.world.size;
  }
  get zoom() {
    return this.gs.zoom;
  }
  getAt(x, y) {
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
  randomPoint() {
    let p = new Vector2(this.pointRandom.between(0, this.worldSize), this.pointRandom.between(0, this.worldSize));
    return {position: p, details: this.getAt(p.x, p.y)};
  }
  gradientAt(x, y) {
    x = x / this.worldSize;
    y = y / this.worldSize;
    const f = (n) => -(4 * this.gs.gradientZoom) * (n - 1) * n;
    let g = f(x) * f(y);
    if (g > 1)
      g = 1;
    return g;
  }
  elevationAt(x, y) {
    let e1 = this.elevationNoise.noise2D(x / this.zoom, y / this.zoom);
    let e2 = this.elevationNoise2.noise2D(x * 2 / this.zoom, y * 2 / this.zoom);
    let e = normalise((e1 + this.gs.elev2proportion * e2) / (1 + this.gs.elev2proportion));
    e = Math.pow(e, this.gs.exp);
    return e - (1 - this.gradientAt(x, y));
  }
  moistureAt(x, y) {
    let m = normalise(this.moistureNoise.noise2D(x / this.zoom * 2, y / this.zoom * 2));
    return m;
  }
  temperatureAt(x, y) {
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
