var webpack = require('webpack')
var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
var PurifyCss = require('purifycss-webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var glob = require('glob-all')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* 输出到指定目录下 */
		path: path.resolve(__dirname, 'dist'),
		/* 输出文件都带有 / 前缀 */
		publicPath: '/',
		/* 初始化打包名称 */
		filename: '[name]-bundle-[hash:5].js',
		/* 动态打包名称 */
		chunkFilename: '[name].bundle.js'
	},
	// webpack4 替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码
	optimization: {
		// 多文件才能工作
		splitChunks: {
			name: 'manifest',
			// 那种会被打包到公共代码里, "initial" | "all"(default) | "async",
			chunks: 'initial',
			// 最小生成 chunk 大小
			minSize: 30000,
			// 最少出现 ？ 次就将其提取到公共代码里
			minChunks: 2,
			// max number of parallel requests when on-demand loading.
			maxAsyncRequests: 1,
			// max number of parallel requests at an entry point.
			maxInitialRequests: 1
		}
	},
	resolve: {
		alias: {
			/* 找到本地的 jquery */
			jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
		}
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				/* 提取 css */
				use: ExtractTextWebpackPlugin.extract({
					/* 提取出文件用什么处理 */
					fallback: {
						/* 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里 */
						loader: 'style-loader',
						options: {
							/* singleton (是否只使用一个 style 标签) */
							singleton: true,
							/* transform (转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式) */
							transform: './css.transform.js'
						}
					},
					use: [
						{
							/* 打包时把 css 文件拆出来，css 相关模块最终打包到一个指定的 css文件中，
              我们手动用 link 标签去引入这个 css 文件就可以了 */
							loader: 'css-loader',
							options: {
								/* 在 css-loader 前应用的 loader 的数量 */
								importLoaders: 2,
								/* 是否压缩 */
								minimize: true,
								/* 启用 css-modules */
								modules: true,
								/* 定义编译出来的名称 */
								localIdentName: '[path][name]_[local]_[hash:base64:5]'
							}
						},
						{
							/* 将 css3 属性添加上厂商前缀 */
							loader: 'postcss-loader',
							options: {
								/*  webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). 
                The ident can be freely named as long as it is unique. 
                It's recommended to name it (ident: 'postcss') */
								ident: 'postcss',
								plugins: [
									/* 加 css 各浏览器前缀 */
									require('autoprefixer')(),
									/* 使用未来的 css 语法 */
									require('postcss-cssnext')(),
									/* 压缩 css */
									require('cssnano')(),
									/* 图片合并成一张图 */
									require('postcss-sprites')({
										spritePath: 'dist/assets/imgs/sprites',
										retina: true
									})
								]
							}
						},
						{
							/* 放置 css-loader 下面 */
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
											node: current,
											browsers: ['> 1%', 'last 2 versions']
										}
									}
								]
							],
							plugins: ['lodash'],
							exclude: '/node_modules/'
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
							/* 超出 1000 处理成 base64 */
							limit: 1000,
							/* 图片地址不对, 设置绝对路径 */
							publicPath: '',
							/* 放到 dist 目录 */
							outputPath: 'dist/',
							/* 设置相对路径 */
							useRelativePath: true
						}
					},
					{
						/* 压缩图片 */
						loader: 'img-loader',
						options: {
							pngquant: {
								/* 压缩 png */
								quality: 80
							}
						}
					}
				]
			},
			{
				/* 字体文件 */
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							/* 超出 5000 处理成 base64 */
							limit: 5000,
							/* 图片地址不对, 设置绝对路径 */
							publicPath: '',
							/* 放到 dist 目录 */
							outputPath: 'assets/imgs/',
							/* 设置相对路径 */
							useRelativePath: true
						}
					}
				]
			},
			{
				test: path.resolve(__dirname, 'src/app.js'),
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
						loader: 'html-loader',
						options: {
              // html 处理引入的图片
							attrs: ['img:src', 'img:data-src']
						}
					}
				]
			}
		]
	},
	plugins: [
		/* 提取 css */
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			/* 指定提取 css 范围, 提取初始化 */
			allChunks: false
		}),
		/* 去除多余的 css */
		new PurifyCss({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './src/*.js')
			])
		}),
		/* 去除多余的 js */
		new UglifyJsPlugin(),
		new webpack.ProvidePlugin({
			/* 使用 install jquery */
			$: 'jquery'
		}),
		/* 生成创建 html 入口文件 */
		new HtmlWebpackPlugin({
			/* filename: 输出文件的名字 */
			filename: 'index.html',
			/* template: 本地模版的位置 */
			template: './index.html',
			/* 向 template 或者 templateContent 中注入所有静态资源 */
			// inject: false,
			/* 允许插入到模板中的一些 chunk */
			chunks: ['app'],
			/* 压缩 */
			minify: {
				collapseWhitespace: true
			}
		}),
		/* chunk 加到 html 中 */
		new HtmlInlineChunkPlugin({
			inlineChunks: ['manifest']
		})
	]
}
