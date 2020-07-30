import { SceneBase } from './SceneBase';
import type World from '../models/World';
import { generateWorldTexture, WorldGenerationSettings } from '../generation/generateWorld';

export default class WorldMap extends SceneBase {
	private gs: WorldGenerationSettings;
	private map: Phaser.GameObjects.Image;
	create(data: { world: World }) {
		this.map = this.add.image(0, 0, generateWorldTexture(this, data.world));
		this.map.setOrigin(0, 0);
		this.map.setDisplaySize(this.gameHeight, this.gameHeight);
	}
}
