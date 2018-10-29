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
							transform: './css-transform.js'
						}
					},
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true,
								modules: true,
								localIdentName: '[path][name]_[local]_[hash:base64:5]'
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: [
									require('autoprefixer')(),
									require('postcss-cssnext')(),
									require('cssnano')()
								]
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
			filename: '[name].min.css',
			allChunks: false
		})
	]
}
