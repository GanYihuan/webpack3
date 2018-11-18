const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const PurifyCssWebpack = require('purifycss-webpack')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const globAll = require('glob-all')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const extracLess = new ExtractTextWebpackPlugin({
  filename: 'css/[name]-bundle-[hash:5].css'
})

module.exports = {
  mode: "production",
  entry: {
    app: './src/app.js',
    vendor: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name]-bundle-[hash:5].js',
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
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
    overlay: true,
    hot: true,
    hotOnly: true,
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
        pathRewrite: {
          '': ''
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
              transform: ''
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              miniSize: true,
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
              presets: ['@babel/prset-env'],
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
        test: /.(png|jpg|jpeg|gif)$/,
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
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: ''
            }
          }
        ]
      },
      {
        test: path.resolve(__dirname, ''),
        use: [
          {
            loader: 'imports-laoder',
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
    extractLess,
    new PurifyCssWebpack({
      paths: globAll.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new UglifyJsWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'],
      minify: {
        collapsseWhitespace: true
      }
    }),
    new HtmlWebpackInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotMoudleReplacementPlugin(),
    new webpack.NameModulesPlugin()
  ]
};
