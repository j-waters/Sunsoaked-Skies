const replace = require('@rollup/plugin-replace');

module.exports = {
	scripts: {
		'mount:public': 'mount public --to /',
		'mount:src': 'mount src --to /_dist_',
		'run:tsc': 'tsc --noEmit',
		'run:tsc::watch': '$1 --watch',
	},
	installOptions: {
		installTypes: true,
	},
	plugins: [
		[
			'@snowpack/plugin-webpack',
			{
				/* see "Plugin Options" below */
			},
		],
	],
	installOptions: {
		rollup: {
			plugins: [
				replace({
					'typeof CANVAS_RENDERER': JSON.stringify(false),
					'typeof WEBGL_RENDERER': JSON.stringify(true),
					'typeof EXPERIMENTAL': JSON.stringify(true),
					'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
					'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
					'typeof FEATURE_SOUND': JSON.stringify(true),
				}),
			],
		},
	},
};
