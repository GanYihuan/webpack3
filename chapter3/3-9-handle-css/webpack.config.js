var path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* path.resolve() will return the absolute path of the current working directory. */
		path: path.resolve(__dirname, 'dist'),
		/* Introducing resource paths */
		// publicPath: './dist/',
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				/* Processe from the back to the front */
				use: [
					{
						/* Adds CSS to the DOM by injecting a <style> tag */
						loader: 'style-loader',
						options: {
							/* Reuses a single <style></style> element, instead of adding/removing individual elements for each required module */
							singleton: true,
							/* Transform/Conditionally load CSS by passing a transform/condition function */
							transform: './css.transform.js'
						}
					},
					{
						/* The css-loader interprets @import and url() like import/require() and will resolve them. */
						loader: 'css-loader', 
						options: {
							/* Number of loaders applied before CSS loader */
							// importLoader
							/* compress ? */
							minimize: true,
							/* Enable/Disable css-modules */
							modules: true,
							/* Configure the generated ident */
							localIdentName: '[path][name]_[local]_[hash:base64:5]'
						}
					},
					{
						/* put css-loader below */
						loader: 'sass-loader'
					},
					{
						/* put css-loader below */
						loader: 'less-loader'
					}
				]
			}
		]
	}
}
