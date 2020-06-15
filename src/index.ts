import "phaser";
import config from "./config";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { Menu } from "./scenes/Menu";
import { GameScene } from "./scenes/Game";

new Phaser.Game(
  Object.assign(config, {
    scene: [Boot, Preloader, Menu, GameScene],
  })
);