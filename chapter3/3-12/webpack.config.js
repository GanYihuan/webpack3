var path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
          /* style-loader 创造一个 style 标签，将引入的 css 放置进去 */
          loader: 'style-loader',
          /* 小众功能, 使用link标签, 不能处理多个样式 */
          // loader: 'style-loader/url',
          // loader: 'style-loader/useable'
          options: {
            /* insertAt(插入位置) */
            /* insertInto(插入到 dom) */
            /* insertInto: '#app', */
            /* singleton (是否只使用一个 style 标签) */
            singleton: true,
            /* transform 在样式加载器加载到页面之前修改 CSS */
            transform: './css.transform.js'
          }
        },
        {
          /* css-loader 将 CSS 文件引入到对应的入口文件里 */
          loader: 'css-loader',
          /* 小众功能, 使用link标签, 不能处理多个样式 */
          // loader: 'file-loader'
          options: {
            /* 是否压缩 */
            minimize: true,
            /* 启用 css-modules */
            modules: true,
            /* 定义编译出来的名称 */
            localIdentName: '[path][name]_[local]_[hash:base64:5]'
          }
        },
        {
          /* 放置 css-loader 下面 */
          loader: 'sass-loader'
        }
      ]
    }]
  }
}