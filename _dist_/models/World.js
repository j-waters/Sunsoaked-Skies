import {generateSeed, generateWorldTexture, generateLocations} from "../generation/generateWorld.js";
var Scene = Phaser.Scene;
console.log("");
export default class World {
  constructor(worldType, seed) {
    this.size = 512 * 1.5;
    this.worldType = worldType;
    this.seed = seed;
  }
  generateTexture(scene, size = 512) {
    return generateWorldTexture(scene, this, size);
  }
  get locations() {
    this._locations = this._locations ?? generateLocations(this);
    return this._locations;
  }
  static generate(worldType = "ISLANDS") {
    return new World(worldType, generateSeed());
  }
}
