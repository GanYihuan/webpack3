var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: './dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextWebpackPlugin.extract({
        /* 提取出文件用什么处理 */
        fallback: {
          loader: 'style-loader',
          /* 小众功能, 使用link标签, 不能处理多个样式 */
          // loader: 'style-loader/url'
          options: {
            // insertInto: '#app',
            singleton: true,
            transform: './css.transform.js'
          }
        },
        use: [
          {
            loader: 'css-loader',
            /* 小众功能, 使用link标签, 不能处理多个样式 */
            // loader: 'file-loader'
            options: {
              minimize: true,
              modules: true,
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      })
    }]
  },
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      allChunks: false
    })
  ]
}