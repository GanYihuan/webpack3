let path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    filename: '[name].bundle.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
      minSize: 3000,
      minChunks: 2
    }
  }
}