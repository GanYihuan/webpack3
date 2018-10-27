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
    /* path.resolve() will return the absolute path of the current working directory. */
    /* __dirname: 当前运行的 dir 路径 */
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    /* 有新的 chunk 生成 */
    chunkFilename: '[name].chunk.js'
  },
  /* optimization 配置自己的自定义模式 */
  /* 提取公共代码 */
  optimization: {
    // [splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/)
    splitChunks: {
      // The name of the split chunk
      name: 'vendor',
      // This indicates which chunks will be selected for optimization, "initial" | "all"(default) | "async",
      chunks: "initial",
      // Minimum size for a chunk to be generated.
      minSize: 30000,
      // Minimum number of chunks that must share a module before splitting.
      minChunks: 2,
      // Maximum number of parallel requests when on-demand loading.
      maxAsyncRequests: 1,
      // Maximum number of parallel requests at an entry point.
      maxInitialRequests: 1,
      // cacheGroups:{
      //     priority: 0,
      //     vendor: { 
      //         // Controls which modules are selected by this cache group
      //         test: /react|lodash/,
      //         enforce: true,
      //         // 可设置是否重用该chunk（查看源码没有发现默认值）
      //         reuseExistingChunk: true 
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