const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
		/* Initialize packaged file name */
		filename: '[name].bundle.js',
		/* dynamic packaged file name */
		chunkFilename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				/* Processe from the back to the front */
				use: ExtractTextWebpackPlugin.extract({
					/* `loader` should be used when the CSS is not extracted */
					fallback: {
						/* Adds CSS to the DOM by injecting a <style> tag */
						loader: 'style-loader',
						options: {
							/* Reuses a single <style></style> element, instead of adding/removing individual elements for each required module */
							singleton: true,
							/* Transform/Conditionally load CSS by passing a transform/condition function */
							transform: './css.transform.js'
						}
					},
					use: [
						{
							/* The css-loader interprets @import and url() like import/require() and will resolve them. */
							loader: 'css-loader',
							options: {
								/* compress? */
								minimize: true,
								/* Enable/Disable css-modules */
								modules: true,
								/* Configure the generated ident */
								localIdentName: '[path][name]_[local]_[hash:base64:5]'
							}
						},
						{
							/* put css-loader below */
							loader: 'postcss-loader',
							options: {
								// 下面的插件给 postcss 使用
								ident: 'postcss',
								plugins: [
                  /* css3 Attribute added vendor prefix */
                  // 'autoprefixer' <-- already included in postcss-cssnext
									require('autoprefixer')(),
									/* Use future css syntax */
									require('postcss-cssnext')(),
									/* Compression optimization css */
									require('cssnano')()
								]
							}
						},
						{
							/* put css-loader below */
							loader: 'sass-loader'
						}
					]
				})
			}
		]
	},
	plugins: [
    new BundleAnalyzerPlugin(),
		/* Extract text from a bundle, or bundles, into a separate file. */
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			/* Extract from all additional chunks(by default it extracts only from the initial chunk) */
			allChunks: false
		})
	]
}
