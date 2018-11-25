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
      name: 'manifest',
      chunks: 'initial',
      minChunks: Infinity
    }
  },
  plugins: [
    // chunks 的版本号从数字改成文件名字
    new webpack.NamedChunksPlugin(),
    // modules 的版本号从数字改成相对路径
    new webpack.NamedModulesPlugin()
  ]
}
