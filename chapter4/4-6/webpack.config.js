var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var PurifyCss = require('purifycss-webpack')
var glob = require('glob-all')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var extractLess = new ExtractTextWebpackPlugin({
  filename: 'css/[name]-bundle-[hash:5].css'
})

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    /* 输出文件都带有 dist 前缀 */
    // publicPath: 'dist/',
    publicPath: '/',
    filename: '[name]-bundle-[hash:5].js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      /* 找到本地的 jquery */
      jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
    }
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
                  /* 加 css 各浏览器前缀 */
                  require('autoprefixer')(),
                  /* 使用未来的 css 语法 */
                  require('postcss-cssnext')(),
                  /* 压缩 css */
                  require('cssnano')(),
                  /* 图片合并成一张图 */
                  require('postcss-sprites')({
                    spritePath: 'dist/assets/imgs/sprites',
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
        use: [{
          loader: 'babel-loader',
          options: {
            // presets: ['env'],
            presets: ['@babel/preset-env'],
            plugins: ['lodash']
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          // {
          //   loader: 'file-loader',
          //   options: {
          //     limit: 1000,
          //     /* 图片地址不对, 设置绝对路径 */
          //     publicPath: '',
          //     /* 放到 dist 目录 */ 
          //     outputPath: 'dist/',
          //     /* 设置相对路径 */
          //     useRelativePath: true
          //   }
          // },
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              /* 超出 1000 处理成 base64 */
              limit: 1000,
              /* 图片地址不对, 设置绝对路径 */
              publicPath: '',
              /* 放到 dist 目录 */
              outputPath: 'dist/',
              /* 设置相对路径 */
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              pngquant: {
                /* 压缩 png */
                quality: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].[ext]',
            /* 超出 5000 处理成 base64 */
            limit: 5000,
            /* 图片地址不对, 设置绝对路径 */
            // publicPath: '',
            /* 放到 dist 目录 */
            outputPath: 'assets/imgs/'
            /* 设置相对路径 */
            // useRelativePath: true
          }
        }]
      },
      {
        test: path.resolve(__dirname, 'src/app.js'),
        use: [{
          loader: 'imports-loader',
          options: {
            $: 'jquery'
          }
        }]
      },
      {
        test: /\.html$/,
        use: [{
          /* 将 HMTL 模板文件当做一个 string 输出 */
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:data-src']
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
    new UglifyJsPlugin,
    new webpack.ProvidePlugin({
      /* 使用 install jquery */
      $: 'jquery'
    }),
    /* 生成创建 html 入口文件 */
    new HtmlWebpackPlugin({
      /* filename: 输出文件的名字 */
      filename: 'index.html',
      /* template: 本地模版的位置 */
      template: './index.html',
      /* 向 template 或者 templateContent 中注入所有静态资源 */
      // inject: false,
      /* 允许插入到模板中的一些chunk */
      chunks: ['app'],
      /* 压缩 */
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}