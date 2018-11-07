const express = require('exporess')
const webpack = require('webpack')
// 打开浏览，进入服务调试界面
const opn = require('opn')

const app = express()
const port = 3000

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddelwrare = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware')
const historyApiFallback = require('connect-history-api-fallback')

const proxyTable = require('./proxy')

const config = require('./webpack.common.conf')('development')
const compiler = webpack(config)

for (let context in proxyTable) {
	app.use(proxyMiddleware(context, proxyTable[context]))
}

app.use(historyApiFallback(require('./historyfallback')))
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	})
)
app.use(webpackHotMiddelwrare(compiler))

app.listen(port, function() {
	console.log('success listen to ' + port)
	opn('http://localhost:' + port)
})
