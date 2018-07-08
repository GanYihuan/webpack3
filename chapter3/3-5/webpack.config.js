var webpack = require('webpack')
var path = require('path')

module.exports = {
  mode: 'production',
  /* 打包, 多文件才能起效果 */
  entry: {
    'pageA': './src/pageA',
    'pageB': './src/pageB',
    'vendor': ['lodash']
  },
  output: {
    /* 输出到指定目录下 */
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  // webpack4替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码
  optimization: {
    splitChunks: {
      name: 'vendor',
      minChunks: Infinity
    }
  }
}