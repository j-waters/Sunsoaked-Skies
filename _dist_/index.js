import "../web_modules/phaser.js";
import config2 from "./config.js";
import {Boot as Boot2} from "./scenes/Boot.js";
import {Preloader as Preloader2} from "./scenes/Preloader.js";
import {StateManager as StateManager2} from "./states/StateManager.js";
let game = new Phaser.Game(Object.assign(config2, {
  scene: [Boot2, Preloader2]
}));
StateManager2.sceneManager = game.scene;
