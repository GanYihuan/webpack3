// commonjs
module.exports = {
  // mode: 'production',
  // 入口
  entry: {
    app: './app.js'
  },
  // 出口
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'my-first-webpack.bundle.js'
    filename: '[name].[hash:5].js'
  }
}