const path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		pageA: './src/pageA',
    pageB: './src/pageB',
    // third-part package
		vendor: ['lodash']
	},
	output: {
		/* path.resolve(): return the absolute path of the current working directory */
    path: path.resolve(__dirname, './dist'),
    /* introduce resource paths */
		// publicPath: './dist/',
		/* init packaged fileName */
		filename: '[name].bundle.js',
    /* dynamic packaged fileName */
		chunkFilename: '[name].chunk.js'
	},
	/* Extract common code */
	optimization: {
    /* package, Multiple files can only work */
		// [splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/)
		splitChunks: {
			// name of the split chunk
			name: 'vendor',
			// which chunks will be selected for optimization, "initial" | "all"(default) | "async",
			chunks: 'initial',
			// Minimum size for a chunk to be generated.
			minSize: 30000,
			// mini number of chunks that must share a module before splitting
			minChunks: 2,
			// Maximum number of parallel requests when on-demand loading.
			maxAsyncRequests: 1,
			// Maximum number of parallel requests at an entry point.
			maxInitialRequests: 1
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
