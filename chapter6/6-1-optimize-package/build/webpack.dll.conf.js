const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vue: ['vue', 'vue-router']
  },
  output: {
    path: path.join(__dirname, '../src/dll/'),
    filename: '[name].dell.js',
    library: '[name]'
  },
  plugins: [
    // 这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。
    new webpack.DllPlugin({
      // manifest json 文件的绝对路径 (输出文件)
      path: path.join(__dirname, '../src/dll/', '[name]-mainifest.js'),
      // 暴露出的 DLL 的函数名
      name: '[name]_[hash]'
    }),
    new UglifyJsPlugin()
  ]
}
