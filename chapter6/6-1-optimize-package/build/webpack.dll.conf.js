const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vue: ['vue', 'vue-router'],
    ui: ['element-ui']
  },
  output: {
    path: path.join(__dirname, '../src/dll/'),
    filename: '[name].dll.js',
    // 产生全局变量
    library: '[name]'
  },
  plugins: [
    // 拆分 bundles, 分开 vendor & app
    new webpack.DllPlugin({
      // manifest json 文件的绝对路径 (输出文件)
      path: path.join(__dirname, '../src/dll/', '[name]-manifest.json'),
      // 暴露出的 Dll 的函数名
      name: '[name]'
    }),
    new UglifyJsPlugin({
      parallel: true,
      cache: true
    })
  ]
}
