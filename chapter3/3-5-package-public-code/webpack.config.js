const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	mode: 'production',
	entry: {
		pageA: './src/pageA',
    pageB: './src/pageB',
    // third-part package
		vendor: ['lodash']
	},
	output: {
		/* return the absolute path of the current working directory */
    path: path.resolve(__dirname, './dist'),
    /* introduce resource paths */
		// publicPath: './dist/',
		/* init packaged fileName */
		filename: '[name].bundle.js',
    /* dynamic packaged fileName */
		chunkFilename: '[name].chunk.js'
	},
  // webpack4 替代 webpack.optimize.CommonsChunkPlugin, 打包公共代码
	optimization: {
    /* 适用于多 entry 情况 */
		// [splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/)
		splitChunks: {
			// name of the split chunk
      name: 'vendor',
      // names: ['vendor', 'manifest'],
			// which chunks will be selected for optimization, "initial" | "all"(default) | "async",
      // 指定提取范围
      chunks: 'initial',
			// mini size for a chunk to be generated.
			minSize: 30000,
      // mini number of chunks that must share a module before splitting
      // 需要提取的公共代码出现的次数，出现 2 次提取到公共代码
			minChunks: 2,
			// Maximum number of parallel requests when on-demand loading.
			maxAsyncRequests: 1,
			// Maximum number of parallel requests at an entry point.
			maxInitialRequests: 1
		}
  },
  plugins: [
    new BundleAnalyzerPlugin()
    /* webpack3 abandon */
    // new webpack.optimize.CommonsChunkPlugin({
	  //   name: 'common',
	  //   minChunks: 2
	  // })
  ]
}
