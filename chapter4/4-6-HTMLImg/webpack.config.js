var webpack = require('webpack')
var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var glob = require('glob-all')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* path.resolve() will return the absolute path of the current working directory. */
		path: path.resolve(__dirname, 'dist'),
		/* Introducing resource paths */
		publicPath: '/',
		/* Initialize packaged file name */
		filename: '[name].bundle.js',
		/* dynamic packaged file name */
		chunkFilename: '[name].bundle.js'
	},
	/* Configure how modules are resolved */
	resolve: {
		/* Create alias to import or require certain modules more easily */
		alias: {
			/* local js import */
			jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
		}
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
								/*  webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). The ident can be freely named as long as it is unique. It's recommended to name it (ident: 'postcss') */
								ident: 'postcss',
								plugins: [
									/* css3 Attribute added vendor prefix */
									require('autoprefixer')(),
									/* Use future css syntax */
									require('postcss-cssnext')(),
									/* Compression optimization css */
									require('cssnano')(),
									/* Sprite: Merge into a single picture */
									require('postcss-sprites')({
										/* Specify output path */
										spritePath: 'dist/assets/imgs/sprites',
										/* handle retina screen */
										retina: true
									})
								]
							}
						},
						{
							/* put css-loader below */
							loader: 'sass-loader'
						}
					]
				})
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['lodash']
						}
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							/* over 1000 handle to base64 */
							limit: 1000,
							/* Set absolute path */
							publicPath: '',
							/* put dist file dialog */
							outputPath: 'dist/',
							/* Set relative path */
							useRelativePath: true
						}
					},
					{
						/* compress img */
						loader: 'img-loader',
						options: {
							/* .png */
							pngquant: {
								/* compress png */
								quality: 80
							}
						}
					}
				]
			},
			{
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
						/* A loader for webpack which transforms files into base64 URIs */
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							/* over 5000 handle to base64 */
							limit: 5000,
							/* Set absolute path */
							publicPath: '',
							/* put dist file dialog */
							outputPath: 'dist/',
							/* Set relative path */
							useRelativePath: true
						}
					}
				]
			},
			{
				/* third-party modules js import */
				test: path.resolve(__dirname, 'src/app.js'),
				use: [
					{
						/* The imports loader allows you to use modules that depend on specific global variables. */
						loader: 'imports-loader',
						options: {
							$: 'jquery'
						}
					}
				]
      },
      {
        test: /\.html$/,
        use: [{
          /* Exports HTML as string */
          loader: 'html-loader',
          options: {
            /* HTML handle import img */
            attrs: ['img:src', 'img:data-src']
          }
        }]
      }
		]
	},
	plugins: [
		/* Extract text from a bundle, or bundles, into a separate file. */
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			/* Extract from all additional chunks(by default it extracts only from the initial chunk) */
			allChunks: false
		}),
		/* put ExtractTextWebpackPlugin below */
		/* css compress */
		new PurifyCss({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './src/*.js')
			])
		}),
		/* js compress */
		new UglifyJsPlugin(),
		/* Automatically load modules instead of having to import or require them everywhere. */
		/* third-party modules js import (use npm) */
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		/* The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles */
		new HtmlWebpackPlugin({
			/* output file name */
			filename: 'index.html',
			template: './index.html',
			/* css, js Insert into the page by label */
			// inject: false,
			/* Specify which ones to add to the html page */
			chunks: ['app'],
			/* compress */
			minify: {
				collapseWhitespace: true
			}
		})
	]
}
