import 'phaser';
import config from './config';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { StateManager } from './states/StateManager';

let game = new Phaser.Game(
	Object.assign(config, {
		scene: [Boot, Preloader],
	}),
);

StateManager.sceneManager = game.scene;
