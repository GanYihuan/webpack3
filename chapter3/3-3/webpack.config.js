module.exports = {
  mode: 'production',
  entry: {
    app: './app.js'
  },
  output: {
    filename: '[name].[hash:5].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          /* 规范的总结 */
          presets: [
            ['@babel/preset-env', {
              targets: {
                /* 指定 Node.js 的版本 */
                "node": "current",
                browsers: ['> 1%', 'last 2 versions']
              }
            }]
          ]
        }
      },
      /* 排除规则之外 */
      exclude: '/node_modules/'
    }]
  }
}