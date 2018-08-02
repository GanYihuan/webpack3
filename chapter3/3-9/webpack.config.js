var path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    /* 引入资源路径 */
    // publicPath: './dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
          /* style-loader 将 css 文件内容放在 style 标签内并插入 head 中 */
          loader: 'style-loader',
          /* 小众功能, 使用 link 标签, 不能处理多个样式 */
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
          /* css-loader 处理 css 文件中 @import，url 之类的语句 */
          loader: 'css-loader',
          /* 小众功能, 使用 link 标签, 不能处理多个样式 */
          // loader: 'file-loader'
          options: {
            /* 是否压缩 */
            minimize: true,
            /* 启用 css-modules */
            modules: true,
            /* 定义编译出来的名称 */
            localIdentName: '[path][name]_[local]_[hash:base64:5]'
          }
        }
      ]
    }]
  }
}