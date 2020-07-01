import "phaser";
import config from "./config";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { Menu } from "./scenes/Menu";
import { GameScene } from "./scenes/Game";
import Ship from "./models/Ship";
import Room from "./models/Room";
import { generateGrid } from "./procedural/generateShip";
import { ShipScene } from "./scenes/ShipScene";

let game = new Phaser.Game(
	Object.assign(config, {
		scene: [Boot, Preloader, Menu, GameScene, ShipScene],
	})
);
