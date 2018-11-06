var webpack = require('webpack')
var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var PurifyCssWebpack = require('purifycss-webpack')
var UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
var glob = require('glob-all')

module.exports = {
  mode: 'production',
  entry: {
    app: './app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: '[name]-[hash:5].js',
    chunkFilename: '[name]-bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      chunks: 'initial',
      minChunks: 2,
      minSize: 30000,
      maxAsyncRequests: 1,
      maxInitialRequests: 1
    }
  },
  resolve: {
    alisa: {
      jquery$: path.resolve(__dirname, '')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
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
                importloaders: 2,
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
                  require('autopreifixer')(),
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
              preesets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                      browsers: ['> 1%', 'last 2 versions']
                    }
                  }
                ]
              ],
              plugins: ['lodash']
            }
          }
        ]
      },
      {
        test: /\.(png|jqg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 1000,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              qngquant: {
                quolity: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|svg|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-bundle.[ext]',
            limit: 5000,
            publicPath: '',
            outputPath: 'dist/',
            useRelativePath: true
          }
        }
      },
      {
        test: path.resolve(__dirname, ''),
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
              attrs: ['img:src']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      allChunks: false
    }),
    new PurifyCssWebpack({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UglifyJsWebpackPlugin,
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackInlineChunkPlugin({
      inlneChunk: ['manifest']
    })
  ]
};
