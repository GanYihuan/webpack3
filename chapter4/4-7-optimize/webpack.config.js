const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const PurifyCss = require('purifycss-webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const glob = require('glob-all')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* return the absolute path of the current working directory. */
		path: path.resolve(__dirname, 'dist'),
		/* dynamic load code path */
		publicPath: '/',
		/* Initialize packaged file name */
		filename: '[name].bundle.js',
		/* dynamic packaged file name */
		chunkFilename: '[name].bundle.js'
	},
	// webpack4 replace webpack.optimize.CommonsChunkPlugin, extract public code
	optimization: {
		/* package, Multiple entry can only work */
		splitChunks: {
      name: 'manifest',
      // names: ['vendor', 'manifest'],
			// which type will package to public code, "initial" | "all"(default) | "async",
			chunks: 'initial',
			// min generate chunk size
			minSize: 30000,
			// min appear times extract to public code
			minChunks: 2
			// max number of parallel requests when on-demand loading.
			// maxAsyncRequests: 1,
			// max number of parallel requests at an entry point.
			// maxInitialRequests: 1
		}
	},
	resolve: {
		/* Create alias to import or require certain modules more easily */
		alias: {
			/* local jq import */
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
            /* Adds CSS to the DOM by injecting a <link/> tag */
            // loader: 'style-loader/url',
            /* wether use style-loader */
						// loader: 'style-loader/useable',
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
								/* number of loaders applied before CSS loader */
								// importLoaders: 2,
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
                /* below plugin use for postcss */
                ident: 'postcss',
								plugins: [
									/* css3 Attribute added vendor prefix */
									require('autoprefixer')(),
									/* Use future css syntax */
									require('postcss-cssnext')(),
									/* Compression optimization css */
									require('cssnano')(),
									/* mutil sprites picture merge into a single picture */
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
              /* for lodash, uglifyjswebpackplugin no working, use babel-plugin-lodash can compress lodash */ 
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
							/* Set absolute path, remove above 'dist/' path */
							publicPath: '',
						  /* put in dist file */
							outputPath: 'dist/',
							/* set relative path, put in assets/imgs file */
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
							/* Set absolute path, remove above 'dist/' path */
							publicPath: '',
							/* put in dist file */
							outputPath: 'dist/',
							/* set relative path, put in assets/imgs file */
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
						/* The imports loader allows you to use modules that depend on specific global constiables. */
						loader: 'imports-loader',
						options: {
							$: 'jquery'
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
            /* HTML which handle by webpack, comporess optimize */
						loader: 'html-loader',
						options: {
							attrs: ['img:src', 'img:data-src']
						}
					}
				]
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
		}),
		/* put ExtractTextWebpackPlugin below */
		/* css compress */
		new PurifyCss({
      /* load mutil path */
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
    /* auto load css, js file */
		new HtmlWebpackPlugin({
			/* output file name */
			filename: 'index.html',
			template: './index.html',
			/* css, js file insert into the html by tag */
			// inject: false,
			/* Specify which entry to add to the html page */
			// chunks: ['app'],
			/* compress html file */
			minify: {
				collapseWhitespace: true
			}
		}),
		/* chunk add to html */
		new HtmlInlineChunkPlugin({
			inlineChunks: ['manifest']
		})
	]
}
