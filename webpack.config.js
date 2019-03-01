const webpack = require('webpack')
const HtmlWebpackPlugin =  require('html-webpack-plugin')
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
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
      maxInitialRequests: 1
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
    open: true,
    compress: true,
    overlay: true,
    hot: true,
    hotOnly: true,
    lazy: true,
    https: true,
    contentBase: path.join(__dirname, 'dist'),
    port: 9001,
    openPage: '',
    historyApiFallback: {
      rewrites: [
        {
          from: '',
          to: function() {
            return ''
          }
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
        pathRewrite: {
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
              minmize: true,
              modules: true,
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
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
                  spritePath: 'dist/assets/imgs/sprites',
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
              plugins: ['lodash', '@babel/tranform-runtime']
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
            laoder: 'url-loader',
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
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: 'assets/imgs/'
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
              attrs: ['img:src',' img:data-src']
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
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
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
      tempalte: './index.html',
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
