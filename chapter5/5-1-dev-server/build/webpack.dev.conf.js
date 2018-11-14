const path = require('path')
const webpack = require('webpack')
const proxy = require('./proxy')
const historyFallback = require('./historyfallback')

module.exports = {
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
		// historyApiFallback: true,
		historyApiFallback: historyFallback,
		// 在同域名下发送 API 请求
		proxy: proxy
	},
	plugins: [
		// 热更新
		new webpack.HotModuleReplacementPlugin(),
		// 路径输出
		new webpack.NamedModulesPlugin()
	]
}
