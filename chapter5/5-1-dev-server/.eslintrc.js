// https://eslint.org/docs/user-guide/configuring
module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint'
	},
	env: {
		browser: true
	},
	extends: [
		// https://github.com/standard/standard/blob/master/docs/RULES-en.md
		'standard'
	],
	plugins: [],
	rules: {
		quotes: 0,
		'spaced-comment': 0,
		'no-unused-vars': 0,
		'no-multiple-empty-lines': 0,
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		semi: ['error', 'never'],
		'no-tabs': 0,
		indent: 0,
		'space-before-function-paren': 0,
		'func-call-spacing': 0,
		'no-mixed-spaces-and-tabs': 0
	}
}
