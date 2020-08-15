module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
	env: {
		node: true,
	},
	rules: {
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'no-constant-condition': 'warn',
	},
};
