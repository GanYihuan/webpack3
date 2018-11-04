var path = require('path')
var ExtractTextWepackPlugin = require('extract-text-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var UgrifyJsPlugin = require('ugrifyjs-webpack')
var glob = require('glob-all')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextWepackPlugin.extract({
          fallbacl: {
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
                localIdentName: '[path][name]_[local]_[hash:base64:5]'
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
                  '@babel/preset-env',
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
    new ExtractTextWepackPlugin({
      filename: '[name].min.css',
      allChunks: false
    }),
    new PurifyCss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UgrifyJsPlugin()
  ]
};
