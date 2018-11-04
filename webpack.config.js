var webpack = require('webpack')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var HtmlwebpackPlugin = require('html-webpack-plugin')
var HtmlwebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
var PurifyCssPlugin = require('purifycss-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var glob = require('glob')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: './dist',
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js'
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'initial',
			miniSize: 30000,
			miniChunks: 2,
			maxInitialRequests: 1,
			maxAsyncRequests: 1
		}
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
								localIdentName: '[path][name]_[local]_[hash:base65:6]'
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: [
									require('autoprefixer')(),
									require('postcss-cssnext')(),
									require('cssnano')(),
									require('postcss-sprites')({
										retina: true,
										sprites: ''
									})
								]
							}
						},
						{
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
							presets: [
								[
									'@babel/preset-env',
									{
										targets: {
											node: 'current',
											browsers: ['> 1%', 'last 2 versions']
										}
									}
								]
							],
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
							limit: 3000,
							publicPath: '',
							outputPath: 'dist/',
							useRelativePath: true
						}
					},
					{
						loader: 'img-loader',
						options: {
							pngquant: {
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
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 5000,
							publicPath: '',
							outpuPath: 'dist/',
							useRelativePath: true
						}
					}
				]
			},
			{
				test: Path.resolve(__dirname, ''),
				use: [
					{
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
						laoder: 'html-loader',
						options: {
							attrs: ['img:src', 'img:data-src']
						}
					}
				]
			}
		]
	},
	plugins: [
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			allChunks: false
		}),
		new PurifyCssPlugin({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './*.js')
			])
		}),
		new UglifyJsPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		new HtmlwebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			minify: {
				collapseWhitespace: true
			}
		}),
		new HtmlwebpackInlineChunkPlugin({
			inlineChunks: ['mainifest']
		})
	]
}
