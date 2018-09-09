var webpack = require('webpack')
var path = require('path')

module.exports = {
  mode: 'production',
  /* 打包, 多文件才能起效果 */
  entry: {
    'pageA': './src/pageA',
    'pageB': './src/pageB',
    /* 第三方依赖, jquery 之类 */
    'vendor': ['lodash']
  },
  output: {
    /* 输出到指定目录下 */
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    /* 有新的 chunk 生成 */
    chunkFilename: '[name].chunk.js'
  },
  /* optimization 配置自己的自定义模式 */
  /* webpack4 replace webpack.optimize.CommonsChunkPlugin, 提取公共代码 */
  optimization: {
    splitChunks: {
      name: 'vendor',
      // 必须三选一： "initial" | "all"(默认就是all) | "async",
      chunks: "initial",
      // 最小尺寸，默认0
      minSize: 0,
      // 最小 chunk ，默认1
      minChunks: 1,
      // 最大异步请求数， 默认1
      maxAsyncRequests: 1,
      // 最大初始化请求书，默认1
      maxInitialRequests: 1,
      // name: function(){}, // 名称，此选项可接收 function
      // cacheGroups:{ // 这里开始设置缓存的 chunks
      //     priority: 0, // 缓存组优先级
      //     vendor: { // key 为 entry 中定义的 入口名称
      //         chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步) 
      //         test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
      //         name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
      //         minSize: 0,
      //         minChunks: 1,
      //         enforce: true,
      //         maxAsyncRequests: 1, // 最大异步请求数， 默认1
      //         maxInitialRequests : 1, // 最大初始化请求书，默认1
      //         reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
      //     }
      // }
    }
  }
  /* webpack3 abandon */
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: 'common',
  //     minChunks: 2
  //   })
  // ]
}