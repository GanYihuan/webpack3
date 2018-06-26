module.exports = {
  // mode: 'production',
  entry: {
    app: './app.js'
  },
  output: {
    filename: '[name].[hash:5].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // babel-presets: 规范
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }]
              // ['env', {
              //   'targets': {
              //     // The % refers to the global coverage of users from browserslist
              //     'browsers': [ 'last 2 versions']
              //   }
              // }]
            ]
          }
        },
        exclude: '/node_modules/'
      }
    ]
  }
}