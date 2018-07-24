var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var glob = require('glob-all')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [{
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          /* 提取出文件用什么处理 */
          fallback: {
            loader: 'style-loader',
            options: {
              singleton: true,
              transform: './css.transform.js'
            }
          },
          use: [{
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
                  /* 加 css 各浏览器前缀 */
                  require('autoprefixer')(),
                  /* 使用未来的 css 语法 */
                  require('postcss-cssnext')(),
                  /* 压缩 css */
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
        use: [{
          loader: 'babel-loader',
          options: {
            // presets: ['env'],
            presets: ['@babel/preset-env'],
            plugins: ['lodash']
          }
        }]
      }
    ]
  },
  plugins: [
    /* 提取 css */
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      /* 指定提取css范围, 提取初始化 */
      allChunks: false
    }),
    /* 去除多余的 css */
    new PurifyCss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    /* 去除多余的 js */
    new UglifyJsPlugin
  ]
}