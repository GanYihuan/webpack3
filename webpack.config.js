var webpack = require('webpack')
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
    publicPath: 'dist/',
    filename: '[name]-[hash:5].js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 2,
      minSize: 30000,
      minChunks: 2,
      maxAsyncRequests: 1,
      maxInitialRequest: 1
    }
  },
  resolve: {
    alias: {
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
              loader: 'css-laoder',
              options: {
                importLoaders: 2,
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
                  require('cssnano')(),
                  require('postcss-sprites')({
                    spritePath: '',
                    retina: true
                  })
                ]
              }
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
              ],
              plugins: ['lodash'],
              exclude: '/node_modules/'
            }
          }
        ]
      },
      {
        test: /.(png|jqg|jqeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:5].[ext]',
              limit: 1000,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: ''
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
        test: /\.(eot|woff2?|svg|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:5].[ext]',
              limit: 1000,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: ''
            }
          }
        ]
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
            loader: 'html-laoder',
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
        path.join(__dirname, './*.js')
      ])
    }),
    new UglifyJsWebpackPlugin(),
    new HtmlWebpackInlineChunkPlugin({
      inineChunks: ['mainifest']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'],
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};
