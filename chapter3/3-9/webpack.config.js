var path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    /* 输出到指定目录下 */
    path: path.resolve(__dirname, 'dist'),
    /* 引入资源路径 */
    // publicPath: './dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
          /* 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里 */
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
          /* 打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了 */
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