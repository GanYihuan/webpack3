const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	mode: 'production',
	entry: {
		pageA: './src/pageA'
	},
	output: {
		/* path.resolve() will return the absolute path of the current working directory. */
		path: path.resolve(__dirname, 'dist'),
		/* Introducing resource paths */
		// publicPath: './dist/',
		/* Initialize packaged file name */
		filename: '[name].bundle.js',
		/* dynamic packaged file name */
		chunkFilename: '[name].bundle.js'
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
