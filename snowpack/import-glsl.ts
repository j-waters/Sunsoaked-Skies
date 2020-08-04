module.exports = function (snowpackConfig, pluginOptions) {
	return {
		name: 'import-glsl',
		proxy({ fileUrl, fileExt, contents }) {
			if (fileExt === '.glsl') {
				return `export default ${JSON.stringify(contents)};`;
			}
		},
	};
};
