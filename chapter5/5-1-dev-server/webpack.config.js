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
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
		filename: 'js/[name]-bundle-[hash:5].js',
		chunkFilename: '[name].bundle.js'
	},
	// webpack4替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码
	optimization: {
		splitChunks: {
			// name of the split chunk
			name: 'vendor',
			// which chunks will be selected for optimization, "initial" | "all"(default) | "async",
			chunks: 'initial',
			// mini size for a chunk to be generated.
			minSize: 30000,
			// mini number of chunks that must share a module before splitting.
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
	/* 此选项控制是否生成，以及如何生成 source map */
	devtool: 'cheap-module-source-map',
	devServer: {
		/* browser page status bar. tell use package status */
		// inline: false,
		// Tell dev-server to watch the files served
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		// Specify a port number to listen for requests on
		port: 9001,
		// Shows full-screen overlay in the browser when there are compiler errors or warnings
		overlay: true,
		// Enable webpack's Hot Module Replacement feature
		hot: true,
		// Enables Hot Module Replacement without page refresh as fallback in case of build failures.
		hotOnly: true,
		/* 重定向接口请求 */
		// HTML5 History API, the index.html page will likely have to be served in place of any 404 responses
		historyApiFallback: {
			rewrites: [
				{
					from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
					to: function(context) {
						return '/' + context.match[1] + context.match[2] + '.html'
					}
				}
			]
		},
		// Specify a page to navigate to when opening the browser
		// openPage: '',
		// the dev-server will only compile the bundle when it gets requested
		// lazy: true,
		// By default dev-server will be served over HTTP. It can optionally be served over HTTP/2 with HTTPS
		// https: true,
		// send API requests on the same domain
		proxy: {
			'/': {
				// 请求远端服务器
				target: 'https://m.weibo.cn',
				// 找到真实请求的地址, 代理元 dot 到 url
				changeOrigin: true,
				// http 请求头
				headers: {
					Cookie: ''
				},
				// 控制台信息
				logLevel: 'debug',
				// 重定向接口请求
				pathRewrite: {
					'^/comments': '/api/comments'
				}
			}
		}
	},
	module: {
		// 执行顺序是后向前
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						/* 在引入 css 时，在最后生成的 js 文件中进行处理，动态创建 style 标签，塞到 head 标签里 */
						loader: 'style-loader',
						options: {
							// singleton 会阻止 sourceMap, 可以关闭 singleton
							sourceMap: true,
							/* singleton(是否只使用一个 style 标签) */
							// singleton: true,
							/* transform(转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式) */
							transform: './css.transform.js'
						}
					},
					{
						/* 打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了 */
						loader: 'css-loader',
						options: {
							sourceMap: true,
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
						/* 将css3属性添加上厂商前缀 */
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
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
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: path.resolve(__dirname, 'src/libs'),
				use: [
					{
						loader: 'babel-loader',
						options: {
							// presets: ['env'],
							presets: ['@babel/preset-env'],
							plugins: ['lodash']
						}
					},
					{
						// 放置 babel-loader 之后
						loader: 'eslint-loader',
						options: {
							formatter: require('eslint-friendly-formatter')
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
							// publicPaths: '',
							/* 放到 dist 目录 */
							outputPath: 'assets/imgs/'
							/* 设置相对路 */
							// useRelativePath: true
						}
					}
				]
			},
			// {
			// 	test: path.resolve(__dirname, 'src/app.js'),
			// 	use: [
			// 		{
			// 			loader: 'imports-loader',
			// 			options: {
			// 				$: 'jquery'
			// 			}
			// 		}
			// 	]
			// },
			{
				test: /\.html$/,
				use: [
					{
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
		/* 提取 css */
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			/* 指定提取css范围, 提取初始化 */
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
			// chunks: ['app'],
			/* 压缩 */
			minify: {
				collapseWhitespace: true
			}
		}),
		/* chunk 加到 html 中 */
		new HtmlInlineChunkPlugin({
			inlineChunks: ['manifest']
		}),
		// 打包后清除目录
		new CleanWebpackPlugin(['dist']),
		// 热更新
		new webpack.HotModuleReplacementPlugin(),
		// 热更新时路径输出
		new webpack.NamedModulesPlugin()
	]
}
