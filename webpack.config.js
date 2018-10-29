var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextWebpackPlugin.extract({
					fallback: {
						loader: 'style-loader',
						options: {
							singleton: true,
							transform: ''
						}
					},
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true,
								modules: true,
								localIdentName: ''
							}
						},
						{
							loader: 'sass-loader'
						}
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextWebpackPlugin({
			filename: '[name].bundle.js',
			allChunks: false
		})
	]
}
