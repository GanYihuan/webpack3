var webpack = require('webpack')
var path = require('path')
var Extract = require('extract-text-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var UglifyJs = require('uglifyjs-webpack-plugin')
var Html = require('html-webpack-plugin')
var HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')

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
  resolve: {
    alias: {
      jquery$: path.resolve(__dirname, '')
    }
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
                  require('cssnano')(),
                  require('postcss-sprites')({
                    spritePath: '',
                    retina: true
                  })
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
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              publicPath: '',
              outputPath: './dist',
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              pngquant: {
                quality: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              publicPath: '',
              outputPath: './dist',
              useRelativePath: true
            }
          }
        ]
      },
      {
        test: path.resolve(__dirname, 'src/app.js'),
        use: [
          {
            loader: 'imports-loader',
            options: {
              $: 'jquery'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:data-src']
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
    new UglifyJs(),
    new webpack.PrefetchPlugin({
      $: 'jquery'
    }),
    new Html({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'],
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlInlineChunkPlugin({
      inlineChunks: ['manifest']
    })
  ]
};
