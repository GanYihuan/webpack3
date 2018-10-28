var webpack = require('webpack')
var path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		pageA: './src/pageA'
	},
	output: {
		/* path.resolve() will return the absolute path of the current working directory. */
		path: path.resolve(__dirname, './dist'),
		/* 发布路径 */
		publicPath: './dist/',
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js'
	}
}
