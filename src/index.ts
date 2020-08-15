import 'phaser';
import config from './config';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { StateManager } from './states/StateManager';

const game = new Phaser.Game(
	Object.assign(config, {
		scene: [Boot, Preloader],
	}),
);

game.registry.set('DEV', import.meta.env.MODE === 'development');

StateManager.sceneManager = game.scene;
