var path = require('path')
var Extract = require('extract-text-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var UglifyJs = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
      minSize: 30000,
      minChunks: true,
      maxInitialRequest: 1,
      maxSyncRequest: 1
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: Extract.extract({
          fallback: {
            loader: 'style-loader',
            options: {
              singleton: true,
              transform: './css-transform.js'
            }
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                localIdentname: '[path][name]_[local]_[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')(),
                  require('postcss-cssnext')(),
                  require('cssnano')()
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/babel-loader',
                  {
                    targets: {
                      node: 'current',
                      browsers: ['> 1%', 'last 2 versions']
                    }
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new Extract({
      filename: '[name].min.css',
      fallback: true
    }),
    new PurifyCss({
      paths: global.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UglifyJs()
  ]
};
