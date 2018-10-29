var path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							singleton: true,
							transform: './css/css-transform.js'
						}
					},
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
			}
		]
	}
}
