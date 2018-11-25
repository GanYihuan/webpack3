const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const productionConfig = require('./webpack.prod.conf')
const developmentConfig = require('./webpack.dev.conf')
const merge = require('webpack-merge')

const generateConfig = env => {
  const extractLess = new ExtractTextWebpackPlugin({
    filename: 'css/[name]-bundle-[hash:5].css'
  })
  const scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ].concat(
    env === 'production'
      ? []
      : [
          {
            loader: 'eslint-loader',
            // loader: 'happypack/loader?id=eslint',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
  )
  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: env === 'developement',
        importLoaders: 2,
        minimize: true,
        modules: true,
        localIdentName: '[path][name]_[local]_[hash:base64:5]'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: env === 'developement',
        ident: 'postcss',
        plugins: [require('autoprefixer')(), require('postcss-cssnext')(), require('cssnano')()].concat(
          env === 'production'
            ? require('postcss-sprites')({
                spritePath: 'dist/assets/imgs/sprites',
                retina: true
              })
            : []
        )
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: env === 'developement'
      }
    }
  ]
  const styleLoader =
    env === 'production'
      ? extractLess.extract({
          fallback: 'style-loader',
          use: cssLoaders
        })
      : [
          {
            loader: 'style-loader'
          }
        ].concat(cssLoaders)
  const fileLoader =
    env === 'development'
      ? [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              outputPath: 'assets/imgs/'
            }
          }
        ]
      : [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 1000,
              outputPath: 'assets/imgs/'
            }
          }
        ]

  return {
    entry: {
      app: './src/app.js'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      filename: 'js/[name]-bundle-[hash:5].js',
      chunkFilename: '[name].bundle.js'
    },
    resolve: {
      alias: {
        jquery$: path.resolve(__dirname, '../src/libs/jquery.min.js')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, '../src')],
          exclude: [path.resolve(__dirname, '../src/libs')],
          use: [scriptLoader]
        },
        {
          test: /\.scss$/,
          use: [styleLoader]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: fileLoader.concat(env === 'production')
            ? {
                loader: 'img-loader',
                options: {
                  pngquant: {
                    quality: 80
                  }
                }
              }
            : []
        },
        {
          test: /\.(eot|woff2?|ttf|svg)$/,
          use: [fileLoader]
        }
      ]
    },
    plugins: [
      extractLess,
      new webpack.ProvidePlugin({
        $: 'jquery'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        minify: {
          collapseWhitespace: true
        }
      })
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config)
}
