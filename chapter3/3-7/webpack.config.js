var webpack = require('webpack')
var path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'pageA': './src/pageA'
  },
  output: {
    /* 输出到指定目录下 */
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  }
}