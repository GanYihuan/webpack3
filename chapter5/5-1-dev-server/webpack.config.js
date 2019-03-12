const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成 html, 即使 css, js 文件名称变化, 能自动加载配对的 css, js 文件
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin') // chunk 加到 html, 提前载入 webpack 加载代码
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 提取 css
const PurifyCssWebpack = require('purifycss-webpack') // 去除多余的 css
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩
const path = require('path')
const globAll = require('glob-all') // 加载多路径
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析
const CleanWebpackPlugin = require('clean-webpack-plugin') // 打包后清除目录

/* 开发环境 */
const extractLess = new ExtractTextWebpackPlugin({
  filename: 'css/[name]-bundle-[hash:5].css'
})

module.exports = {
  mode: 'production',
  // 代码入口 打包入口
  entry: {
    app: './src/app.js',
    /* 第三方模块 */
    vendor: ['lodash']
  },
  // 打包生成的文件
  output: {
    /* 输出到 dist 目录下 */
    path: path.resolve(__dirname, 'dist'),
    /* 修改项目引入资源路径, 使其带有 '/' 前缀 */
    publicPath: '/',
    /* 初始化打包, [name] 对应上面的 entry 名称 */
    // filename: 'js/[name]-bundle-[hash:5].js',
    /* chunkhash 有利于长缓存优化 */
    filename: 'js/[name]-bundle-[chunkhash:5].js',
    /* 动态打包, 如异步引入的文件 */
    chunkFilename: '[name].bundle.js'
  },
  /* webpack4 替代 webpack.optimize.CommonsChunkPlugin, 打包公共代码 */
  optimization: {
    /* 适用于多 entry 情况 */
    splitChunks: {
      /* 混合第三方模块提取 */
      // name: 'vendor',
      /* 第三方模块与代码区分开提取, 有利于长缓存优化 (区分开提取) */
      name: 'manifest',
      /* 需要提取的公共代码出现的次数, Infinity 不会将任何模块打包进去 (区分开提取) */
      minChunks: Infinity,
      /* 生成的 chunks 的最小大小 */
      minSize: 30000,
      /* 指定提取范围. 选择哪些块进行优化, "initial" | "all"(default) | "async" */
      chunks: 'initial',
      /* 按需加载时并行请求的最大数量 */
      maxAsyncRequests: 1,
      /* entry 并行请求的最大数量 */
      maxInitialRequests: 1
    }
  },
  resolve: {
    alias: {
      /* 找到本地的 jquery */
      jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
    }
  },
  /* 如何生成 source-map: 追踪错误和警告 */
  devtool: 'cheap-module-source-map',
  /* 提供一个 web 服务器，能实时重新加载刷新浏览器 */
  devServer: {
    /* 构建消息将会出现在浏览器控制台 */
    inline: false,
    /* 告诉 dev-server 在 server 启动后打开浏览器 */
    open: true,
    /* 指定打开浏览器时的导航页面 */
    openPage: '',
    /* 默认情况下，dev-server 通过 HTTP 提供服务 使用自签名证书 */
    https: true,
    /* 指定要监听请求的端口号 */
    port: 9001,
    /* 压缩 */
    compress: true,
    /* 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层 */
    overlay: true,
    /* 模块热更新, 不刷新浏览器下, 更新代码 */
    hot: true,
    /* 启用热模块替换，在构建失败时不刷新页面作为回退 */
    hotOnly: true,
    /* 在请求时才编译包 webpack 不会监视任何文件改动 */
    lazy: true,
    /* 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要 */
    contentBase: path.join(__dirname, 'dist'),
    /* 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html */
    historyApiFallback: {
      /* 指定文件类型, 匹配了才重定向 */
      // htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      /* 重定向规则 */
      rewrites: [
        {
          from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
          to: function(context) {
            return '/' + context.match[1] + context.match[2] + '.html'
          }
        }
      ]
    },
    /* 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用 */
    proxy: {
      '/': {
        /* 请求远端服务器 */
        target: 'https://m.weibo.cn',
        /* 默认情况下代理时保留主机头的原点，您可以将changeOrigin设置为true以覆盖此行为 */
        changeOrigin: true,
        /* http 请求头 */
        headers: {
          Cookie: 'M_WEIBOCN_PARAMS=luicode%3D20000174%26lfid%3D102803_ctg1_7978_-_ctg1_7978%26uicode%3D20000174%26fid%3D102803_ctg1_7978_-_ctg1_7978; expires=Sun, 25-Nov-2018 16:18:59 GMT; Max-Age=600; path=/; domain=.weibo.cn; HttpOnly'
        },
        /* 控制台显示代理信息 */
        logLevel: 'debug',
        /* 重定向接口请求 */
        pathRewrite: {
          '^/container': '/api/container'
        }
      }
    }
  },
  module: {
    /* 执行顺序是后向前 */
    rules: [
      {
        test: /\.scss$/,
        /* 生产环境 */
        // use: ExtractTextWebpackPlugin.extract({
        //   fallback: {
        //     loader: 'style-loader',
        //     options: {
        //       singleton: true,
        //       transform: './css.transform.js'
        //     }
        //   },
        //   use: [
        //     {
        //       loader: 'sass-loader'
        //     }
        //   ]
        // }),
        /* 处理过程, 从后往前 */
        use: [
          {
            /* 在最后生成的 js 文件中进行处理，动态创建 style 标签，塞到 head 标签里 */
            loader: 'style-loader',
            /* 在最后生成的 js 文件中进行处理，动态创建 link 标签，塞到 head 标签里, 不能处理多样式 */
            // loader: 'style-loader/url',
            /* 控制样式是否插入页面中, 多了 .use() & .unuse() 方法 */
            // loader: 'style-loader/useable',
            options: {
              /* singleton 会阻止 sourceMap */
              sourceMap: true,
              /* 插入 dom 位置 */
              insertInto: '#app',
              /* singleton(是否只使用一个 style 标签) */
              // singleton: true,
              /* 插入页面前, 根据不同浏览器配置不同样式 */
              transform: './css.transform.js'
            }
          },
          {
            /* 让 js 能 @import css 文件进来 */
            loader: 'css-loader',
            options: {
              sourceMap: true,
              /* 在 css-loader 前应用的 loader 的数量, 后往前处理 (sass-loader, postcss-loader 共 2 个) */
              importLoaders: 2,
              /* 是否压缩 */
              minimize: true,
              /* 启用 css-modules */
              // :local                  本地
              // :global                 全局
              // compose                 继承
              // composes ... from       引入
              modules: true,
              /* 定义 css-modules 编译出来文件的名称 */
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          },
          {
            /* 将 css3 属性添加上厂商前缀 */
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              /* 下面的插件给 postcss 使用 */
              ident: 'postcss',
              plugins: [
                /* 加 css 各浏览器前缀 */
                require('autoprefixer')(),
                /* 优化 & 压缩 css */
                require('cssnano')(),
                /* 使用未来的 css 语法 */
                require('postcss-cssnext')(),
                /* 图片合并成一张图 */
                require('postcss-sprites')({
                  /* 输出路径 */
                  spritePath: 'dist/assets/imgs/sprites',
                  /* 处理苹果 retina 屏幕 */
                  retina: true
                })
              ]
            }
          },
          {
            /* 放置 css-loader 下面 */
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        /* 要处理目录 */
        include: path.resolve(__dirname, 'src'),
        /* 不处理目录 */
        exclude: path.resolve(__dirname, 'src/libs'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              /* 将 ES6 的代码转成 ES5 */
              presets: ['@babel/preset-env'],
              /* UglifyJsWebpackPlugin 对 lodash 无用, 使用 babel-plugin-lodash 能去除 lodash 多余 js */
              /* transform-runtime: 能写 es7/8 新方法, 开发组件类库中使 */
              /* babel-polyfill: 能写 es7/8 新方法, 开发应用使用, main.js 中引用 `import babel-polyfill` */
              plugins: ['lodash', '@babel/transform-runtime']
            }
          },
          {
            /* 放置 babel-loader 之后, eslint 校验代码格式 */
            loader: 'eslint-loader',
            options: {
              /* 报错时输入内容的格式更友好 */
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          /* 开发环境 */
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: '[name]-[hash:5].[ext]',
          //     publicPath: '',
          //     outputPath: 'dist/',
          //     useRelativePath: true
          //   }
          // },
          /* 生产环境 */
          {
            /* 处理成 base64 */
            loader: 'url-loader',
            options: {
              /* 生成的图片名称 */
              name: '[name]-[hash:5].[ext]',
              /* 超出 1000 处理成 base64 */
              limit: 1000,
              /* 打头的路径目录为 '' */
              publicPath: '',
              /* 放置在 dist */
              outputPath: 'dist/',
              /* 放置在 assets/imgs, 因为图片原本路径为 (aseets/imgs) */
              useRelativePath: true
            }
          },
          {
            /* 压缩图片 */
            loader: 'img-loader',
            options: {
              /* .png 图片处理 */
              pngquant: {
                /* 压缩 png */
                quality: 80
              }
            }
          }
        ]
      },
      {
        /* 字体文件 */
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              /* 超出 5000 处理成 base64 */
              limit: 5000,
              outputPath: 'assets/imgs/'
            }
          }
        ]
      },
      // {
      //   test: path.resolve(__dirname, 'src/app.js'),
      //   use: [
      //     {
      //       loader: 'imports-loader',
      //       options: {
      //         $: 'jquery'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.html$/,
        use: [
          {
            /* 将HTML导出为字符串。当编译器需要时，HTML被最小化。 */
            loader: 'html-loader',
            options: {
              // html 中引入图片
              attrs: ['img:src', 'img:data-src']
            }
          }
        ]
      }
    ]
  },
  // 参与打包整个过程
  plugins: [
    /* 提取 css, 开发环境 */
    extractLess,
    /* 生产环境 */
    // new ExtractTextWebpackPlugin({
    /* 提取出来的 css 名称, 手动用 link 标签引入 */
    //   filename: '[name].min.css',
    //   /* 指定提取 css 范围, 提取初始化的 css, 异步引入的 css 代码不包括 */
    //   /* 异步引入的文件: import ('./css/components/a').then(function () { */
    //   allChunks: false
    // }),
    /* 打包分析 */
    new BundleAnalyzerPlugin(),
    /* 热更新 */
    new webpack.HotModuleReplacementPlugin(),
    /* module 的版本号从数字改成相对路径 有利于长缓存优化, 热更新时路径输出 */
    new webpack.NamedModulesPlugin(),
    /* chunk 的版本号从数字改成文件名字 有利于长缓存优化 */
    new webpack.NamedChunksPlugin(),
    /* 去除多余的 css, 放置 ExtractTextWebpackPlugin 之后 */
    new PurifyCssWebpack({
      /* 针对指定路径文件来处理, glob-all: 加载多路径 */
      paths: globAll.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    /* 去除多余的 js 优化打包速度 */
    new UglifyJsWebpackPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    /* 第三方模块 js 注入 (use npm install) */
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    /* 生成 html, 即使 css, js 文件名称变化时, 能自动加载配对的 css, js 文件 */
    new HtmlWebpackPlugin({
      /* 输出文件的名字 */
      filename: 'index.html',
      /* 本地模版的位置 */
      template: './index.html',
      /* js, css 通过标签插入到 html 中 */
      // inject: false,
      /* entry chunk 插入到 html */
      chunks: ['app'],
      /* 压缩 */
      minify: {
        collapseWhitespace: true
      }
    }),
    /* chunk 加到 html, 提前载入 webpack 加载代码, manifest: 上面操作提取的公共代码 */
    new HtmlWebpackInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    /* 打包后清除目录 */
    new CleanWebpackPlugin(['dist'])
    /* webpack4 替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码 */
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 2
    // })
  ]
}
