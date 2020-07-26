import 'phaser';

import WebFont from 'webfontloader';

export default class WebFontFile extends Phaser.Loader.File {
	private fontNames: string[];
	/**
	 * @param {Phaser.Loader.LoaderPlugin} loader
	 * @param {string | string[]} fontNames
	 * @param {string} [service]
	 */
	constructor(loader: Phaser.Loader.LoaderPlugin, fontNames: string[]) {
		super(loader, {
			type: 'webfont',
			key: fontNames.toString(),
		});

		this.fontNames = fontNames;
	}

	load() {
		const config = {
			active: () => {
				this.loader.nextFile(this, true);
			},
			custom: {
				families: this.fontNames,
				urls: ['/assets/css/fonts.css'],
			},
		};

		// @ts-ignore
		// console.log(window.WebFont);
		//
		console.log(WebFont);
		// console.log(webfont.load);
		// console.log(webfont.load);

		WebFont.load(config);
	}
}
