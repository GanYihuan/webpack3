var webpack = require('webpack')
var path = require('path')
/* 检查打包后的 css 文件 */
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
/* 对 js 文件进行压缩 */
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
/* 去除多余的 css, 进行 CSS Tree Shaking 操作 */
var PurifyCss = require('purifycss-webpack')
/* glob-all 的作用就是帮助 PurifyCSS 进行路径处理，定位要做 Tree Shaking 的路径文件。 */ 
var glob = require('glob-all')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    /* 输出到指定目录下 */
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [{
        test: /\.scss$/,
        /* 提取 css */
        use: ExtractTextWebpackPlugin.extract({
          /* 提取出文件用什么处理 */
          fallback: {
            /* 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里 */
            loader: 'style-loader',
            options: {
              /* singleton(是否只使用一个 style 标签) */
              singleton: true,
              /* transform(转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式) */
              transform: './css.transform.js'
            }
          },
          use: [{
              /* 打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了 */
              loader: 'css-loader',
              options: {
                /* 是否压缩 */
                minimize: true,
                /* 启用 css-modules */
                modules: true,
                /* 定义编译出来的名称 */
                localIdentName: '[path][name]_[local]_[hash:base64:5]'
              }
            },
            {
              /* 将css3属性添加上厂商前缀 */
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
              /* 放置 css-loader 下面 */
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
    /* 提取 css, 检查打包后的 css 文件 */
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      /* 指定提取 css 范围, 提取初始化 */
      allChunks: false
    }),
    /* 放 ExtractTextWebpackPlugin 后面 */
    /* 去除多余的 css, 进行 CSS Tree Shaking 操作 */
    new PurifyCss({
      /* glob-all 的作用就是帮助 PurifyCSS 进行路径处理，定位要做 Tree Shaking 的路径文件。 */ 
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    /* 对 js 文件进行压缩 */
    new UglifyJsPlugin
  ]
}