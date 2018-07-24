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
          loader: 'style-loader',
          options: {
            singleton: true,
            transform: './css.transform.js'
          }
        },
        {
          loader: 'css-loader',
          options: {
            minimize: true,
            modules: true,
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