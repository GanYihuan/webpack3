var path = require('path')

module.exports = {
  mode: 'production',
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
              // insertAt(插入位置)
              // insertInto(插入到 dom)
              // insertInto: '#app',
              // singleton(是否只使用一个 style 标签)
              singleton: true,
              // transform(转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式)
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