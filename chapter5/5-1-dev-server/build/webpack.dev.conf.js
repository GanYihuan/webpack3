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
    overlay: true,
    hot: true,
    historyApiFallback: historyFallback,
    proxy: proxy
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
