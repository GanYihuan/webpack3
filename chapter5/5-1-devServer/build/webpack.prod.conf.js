const path = require('path')
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurifyCss = require('purifycss-webpack')
const glob = require('glob-all')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const productionConfig = require('./webpack.prod.conf')
// const developmentConfig = require('./webpack.dev.conf')
// const merge = require('webpack-merge')

module.exports = {
	devtool: 'cheap-module-source-map',
	// webpack4替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码
	optimization: {
		splitChunks: {
			name: 'manifest'
		}
	},
	resolve: {
		alias: {
			/* 找到本地的 jquery */
			jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
		}
	},
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
	plugins: [
		/* 去除多余的 css */
		new PurifyCss({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './src/*.js')
			])
		}),
		/* 去除多余的 js */
		new UglifyJsPlugin(),
		/* chunk 加到 html 中 */
		new HtmlInlineChunkPlugin({
			inlineChunks: ['manifest']
		}),
		// 打包清除
		new CleanWebpackPlugin(['dist'])
	]
}
