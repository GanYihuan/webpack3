const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const PurifyCss = require('purifycss-webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const glob = require('glob-all')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* 输出到指定目录下 */
		path: path.resolve(__dirname, 'dist'),
		/* 输出文件都带有 dist 前缀 */
		// publicPath: 'dist/',
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
	// 解释说明我们的目的 （仅解释说明，不要用于生产环境）
	// devtool: 'inline-source-map',
	devtool: 'cheap-module-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9001,
		// 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
		overlay: true,
		// 热更新
		hot: true,
		// 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
		historyApiFallback: true,
		// 在同域名下发送 API 请求
		proxy: {
			'/api': {
				// 请求远端服务器
				target: 'https://m.weibo.cn',
				// 找到真实请求的地址
				changeOrigin: true,
				// 控制台信息
				logLevel: 'debug',
				// 重定向
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
				/* 提取 css */
				use: ExtractTextWebpackPlugin.extract({
					/* 提取出文件用什么处理 */
					fallback: {
						/* 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里 */
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
					use: [
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
				})
			},
			{
				test: /\.js$/,
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
		// 打包清除
		new CleanWebpackPlugin(['dist']),
		// 热更新
		new webpack.HotModuleReplacementPlugin(),
		// 路径输出
		new webpack.NamedModulesPlugin()
	]
}
