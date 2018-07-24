var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextWebpackPlugin.extract({
        /* 提取出来的文件用什么处理 */
        fallback: {
          loader: 'style-loader',
          options: {
            singleton: true,
            transform: './css.transform.js'
          }
        },
        use: [{
            loader: 'css-loader',
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
    /* 提取 css */
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      /* 指定提取 css 范围, 提取初始化 */
      allChunks: false
    })
  ]
}