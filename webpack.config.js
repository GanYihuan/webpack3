const webpack = require('webpaack')
const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurifyCssWebpack = require('purifycss-webpack')
const glob = require('glob-all')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: 'js/[name]-bundle-[hash:5].js',
		chunkFilename: '[name].bundle.js'
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'initial',
			minSize: 30000,
			minChunks: 2,
			maxAsyncRequests: 1,
			maxInitialRequests: 1
		}
	},
	resolve: {
		alias: {
			jquery$: path.resolve(__dirname, '')
		}
	},
	devtool: 'cheap-module-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 90001,
		overlay: true,
		hot: true,
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: '',
				changeOrigin: true,
				logLevel: 'debug',
				pathRewrite: {
					'^/comments': '/api/comments'
				}
			}
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
							sourceMap: true,
							transform: './css-transform.js'
						}
					},
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 2,
								minmize: true,
								modules: true,
								localIdentName: '[path][name]_[local]_[hash:base64:5]'
							}
						},
						{
							loader: 'postcss-loader',
							options: {
                sourceMap: true,
								ident: 'postcss',
								plugins: [
									require('autoprefixer')(),
									require('postcss-cssnext')(),
									require('cssnano')(),
									require('postcss-sprites')({
										sprtePath: '',
										retina: true
									})
								]
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										node: current,
										browsers: ['> 1%', 'last 2 versions']
									}
								}
							]
						],
						plugins: ['@babel/transform-runtime']
					}
				}
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 1000,
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
							limit: 50000,
							outputPath: ''
						}
					}
				]
			},
			{
				test: path.resolve(__dirname, ''),
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
						loader: 'html-laoder',
						options: {
							attrs: ['img:src']
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
		new PurifyCssWebpack({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './src/*.js')
			])
		}),
		new UglifyJsPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			minify: {
				collapseWhitespace: true
			}
		}),
		new HtmlWebpackInlineChunkPlugin({
			inlineChunks: ['mainfest']
		}),
		new CleanWebpackPlugin(['dist']),
		new webpack.HotModuleReplacementPlguin(),
    new webpack.NameModulesPlugin()
	]
}
