const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const ExtractTextWebpack = require('extract-text-webpack-plugin')
const PurifyCssWebpck = require('purifycss-webpack')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const globAll = require('glob-all')

const extractLess = new ExtractTextWebpack({
  filename: 'css/[name]-bundle-[hash:5].css'
})

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js',
    vendor: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, 'dist')
    publicPath: '/',
    filename: 'js/[name]-bundle-[chunkhash:5].js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity,
      minSize: 3000,
      chunks: 'initial',
      maxAsyncRequests: 1,
      maxInitialRequests: 1
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    inline: false,
    hot: true,
    hotOnly: true,
    open: true,
    https: true,
    lazy: true,
    overlay: true,
    compress: true,
    port: 9001,
    openPage: '',
    contentBase: path.resolve(__dirname, 'dist'),
    hisotryApiFallback: {
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
              minimize: true,
              modules: true,
              importLoaders: 2,
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
                require('postcss-nano')(),
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
              name: '[name]-bundle-[hash:5].js',
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
              name: '[name]-bundle.js',
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
              attrs: ['img:data', 'img:data-src']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractLess,
    new BundleAnalyzerPlugin(),
    new webpack.HashedModuleIdsPlugin,
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCssWebpck({
      paths: globAll.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UglifyJsWebpackPlugin({
      uglifyOptions: {
        compress: true
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