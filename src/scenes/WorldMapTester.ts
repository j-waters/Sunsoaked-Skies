import { SceneBase } from './SceneBase';
import type World from '../models/World';
import { generateWorldTexture, WorldGenerationSettings, worldTypes } from '../generation/generateWorld';
import dat from 'dat.gui';

export default class WorldMapTester extends SceneBase {
	private gs: WorldGenerationSettings;
	private debugMenu: dat.GUI;
	private map: Phaser.GameObjects.Image;
	private world: World;
	create(data: { world: World }) {
		this.world = data.world;
		this.map = this.add.image(0, 0, generateWorldTexture(this, this.world, 512));
		this.map.setOrigin(0, 0);
		this.map.setDisplaySize(this.gameHeight, this.gameHeight);

		this.debugMenu = new dat.GUI();
		this.debugMenu.add(worldTypes[this.world.worldType], 'zoom', 30, 200).onFinishChange(() => this.reload());
		this.debugMenu.add(worldTypes[this.world.worldType], 'threshold', 0, 1).onFinishChange(() => this.reload());
		this.debugMenu.add(worldTypes[this.world.worldType], 'exp', 0, 5).onFinishChange(() => this.reload());
		this.debugMenu.add(worldTypes[this.world.worldType], 'gradientZoom', 0, 5).onFinishChange(() => this.reload());
		this.debugMenu.add(worldTypes[this.world.worldType], 'elev2proportion', 0, 1).onFinishChange(() => this.reload());
		this.debugMenu.add(worldTypes[this.world.worldType], 'elevationMod', 0, 2).onFinishChange(() => this.reload());
		this.debugMenu
			.add(
				{
					reSeed: () => (this.world.seed = Math.random().toString()),
				},
				'reSeed',
			)
			.onFinishChange(() => this.reload());
	}

	reload() {
		console.log('refreshing...');
		// @ts-ignore
		this.map.setTexture(generateWorldTexture(this, this.world, 512, this.gs));
		console.log('done');
	}
}
