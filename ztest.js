const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const ExtractTextWebpackPlugin = require('exract-text-webpack-plugin')
const PurifyCssWebpack = require('purifycss-webpack')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const globAll = require('glob-all')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')

const extractLess = new ExtractTextWebpackPlugin({
  filename: 'css/[name]-bundle-[hash:5].css'
})

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js',
    vendor: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name]-bundle-[chunkhash:5].js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity,
      minSize: 30000,
      chunks: 'initial',
      maxAsyncRequests: 1,
      maxInitalReuqests: 1
    }
  },
  resolve: {
    alias: {
      jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    inline: false,
    hot: true,
    hotOnly: true,
    compress: true,
    lazy: true,
    https: true,
    open: true,
    contentBase: path.join(__dirname, 'dist'),
    port: 9001,
    openPage: '',
    historyApiFallback: {
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    },
    proxy: {
      '/': {
        target: '',
        changeOrigin: true,
        headers: {
          Cookie: ''
        },
        logLevel: 'debug',
        pathRewrites: {
          '^/container': '/api/container'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
              insertInto: '#app',
              transform: './css.transform.js'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              minimize: true,
              modules: true,
              localIdentName: ''
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(),
                require('cssnano')(),
                require('postcss-cssnext')(),
                require('postcss-sprites')({
                  spritePath: '',
                  retina: true
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'src/libs'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['lodash', '@babel/transform-runtime']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
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
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loder: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: ''
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
    extractLess,
    new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCssWebpack({
      paths: globAll.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UglifyJsWebpackPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
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
    new HtmlWebpackInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    new CleanWebpackPlugin(['dist'])
  ]
}
