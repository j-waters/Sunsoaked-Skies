import "phaser";

export default {
	type: Phaser.AUTO,
	parent: "game",
	// backgroundColor: "#33A5E7",
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
};
