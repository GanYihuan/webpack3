module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/babel-env',
                  {
                    targets: {
                      node: 'current',
                      browserlist: ['> 1%', 'last 2 versions']
                    }
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
}