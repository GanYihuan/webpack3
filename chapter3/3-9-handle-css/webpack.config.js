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
							/* Reuses a single <style></style> element */
							singleton: true,
							/* load CSS by pase custom function */
              transform: './css.transform.js'
              /* <style></style> insert into given position */
              // insertInto: '#app',
              /* <style></style> insert at given position */
              // insertAt: '#app'
						}
					},
					{
						/* The css-loader interprets @import and url() like import/require() and will resolve them. */
						loader: 'css-loader',
						options: {
							/* number of loaders applied before CSS loader */
							// importLoader
							/* compress ? */
							minimize: true,
							/* enable css-modules ? */
							modules: true,
							/* configure the generate ident */
							localIdentName: '[path][name]_[local]--[hash:base64:5]'
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
