import 'phaser';

export default <Phaser.Types.Core.GameConfig>{
	type: Phaser.WEBGL,
	parent: 'game',
	// backgroundColor: "#33A5E7",
	// render: {
	// 	pixelArt: true,
	// },
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
};
