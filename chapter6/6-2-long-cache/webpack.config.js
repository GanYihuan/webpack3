const webpack = require('webpack')
const path = require('path')

 module.exports = {
	mode: 'production',
	entry: {
    main: './src/foo',
    vendor: ['react']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
      minChunks: Infinity
    }
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
