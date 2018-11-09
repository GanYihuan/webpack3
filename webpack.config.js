const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const PurifyCss = require('purifycss-webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const glob = require('glob-all')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      chunks: 'initial',
      minSize: 30000,
      minChunks: 2
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
              transform: ''
            }
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minmize: true,
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
                  '@babel/prese-env',
                  {
                    targets: {
                      node: 'current',
                      browsers: ['> 1%', 'last 2 versions']
                    }
                  }
                ]
              ],
              plugin: ['@babel/transform-runtime']
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
              limit: 1000,
              publicPath: '',
              outputPath: 'dist/',
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
        test: /\.(eot|woff2|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: true
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
    new BundleAnalyzerPlugin(),
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      allChunks: false
    }),
    new PurifyCss({
      paths: glob.sync([
        path.join(__dirname, ''),
        path.join(__dirname, '')
      ])
    }),
    new UglifyJsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new HtmlWebpackPlugin({
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
}
