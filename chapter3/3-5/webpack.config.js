var webpack = require('webpack')
var path = require('path')

module.exports = {
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
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })
  ]
  /*
  options.name or options.names chunk名称
  options.filename 打包公共代码的文件名
  options.minChunks 代码出现指定次数就提取到公共代码
  options.chunks 提取代码的范围
  options.children 在子模块中查找共同依赖
  options.deepChildren 在所有模块中查找共同依赖
  options.async 创建异步公共代码块
  */
}