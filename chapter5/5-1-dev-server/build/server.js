const express = require('exporess')
const webpack = require('webpack')
// 打开浏览器，进入服务调试界面
const opn = require('opn')
// 启动 express
const app = express()
// 端口
const port = 3000

// webpack express 连接起来
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddelwrare = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware')
const historyApiFallback = require('connect-history-api-fallback')

// 返回开发环境配置
const config = require('./webpack.common.conf')('development')
// 执行配置, compiler 给 express 使用
const compiler = webpack(config)

// 请求微博配置
const proxyTable = require('./proxy')
for (let context in proxyTable) {
	app.use(proxyMiddleware(context, proxyTable[context]))
}
/* 重定向接口请求 */
app.use(historyApiFallback(require('./historyfallback')))

app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	})
)
app.use(webpackHotMiddelwrare(compiler))

// 端口回调
app.listen(port, function() {
	console.log('success listen to ' + port)
	opn('http://localhost:' + port)
})
