var path = require('path')

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
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            /* 小众功能, 使用link标签, 不能处理多个样式 */ 
            // loader: 'style-loader/url'
            options: {
              // insertInto: '#app',
              singleton: true,
              transform: './css.transform.js'
            }
          },
          {
            loader: 'css-loader',
            /* 小众功能, 使用link标签, 不能处理多个样式 */ 
            // loader: 'file-loader'
            options: {
              minimize: true,
              modules: true,
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          }
        ]
      }
    ]
  }
}