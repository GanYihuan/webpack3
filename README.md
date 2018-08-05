# webpack

## 2-5 学习准备 - webpack 核心概念

- entry: 打包入口
- output: 打包生成的文件
- loaders: 转化为模块
- plugins: 参与打包过程, 打包优化, 编译变量
- chunk: 代码块
- bundle: 被打包后的
- module: 模块

## 3-1 由浅入深 webpack - 使用 webpack

```console
webpack -h
webpack -v
webpack <entry> <output>
```

- webpack-cli: 交互式初始化项目, 迁移 v1->v2, 目前不完善

```console
npm install webpack-cli -g
webpack-cli -h
webpack-cli init webpack-addons-demo
```

## 3-2 由浅入深 webpack - 打包 JS

- 调用 webpack; 使用自定义 webpack 名称调用 webpack

```console
webpack
webpack --config webpack-selfdefind.js
```

## 3-3 由浅入深 webpack - 编译 ES6

- babel-preset: 规范的总结, 指定浏览器环境(为应用)
- env: 包含所有规范, es2015, es2016, es2017
- babel-preset-env: 可以根据配置的目标浏览器或者运行环境来自动将ES2015+的代码转换为es5
- 可以通过 .babelrc 文件来指定特定的目标浏览器
- babel-polyfill: 全局垫片污染全局, 能写 es7/8 新方法, 对编译的代码中新的API进行处理, 适合在业务项目中使用, 在 main.js 中引用 `import babel-polyfill`
- babel-runtime-transform: 局部垫片不会污染全局, 能写 es7/8 新方法, 对编译的代码中新的API进行处理, 适合在组件类库项目中使用, 在 .babelrc 文件中使用

```console
npm install babel-loader@8.0.0-beta.0 @babel/core
<!-- 选上 -->
npm i babel-loader babel-core -D

npm i @babel/preset-env -D
<!-- 选上 -->
npm i babel-preset-env -D

<!-- import 'babel-polyfill' -->
npm i babel-polyfill -S

npm i @babel/plugin-transform-runtime -D
<!-- 选上 -->
npm i babel-plugin-transform-runtime -D

npm i @babel/runtime -S
<!-- 选上 -->
npm i babel-runtime -S
```

```js
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      /* 规范的总结 */
      presets: [
        ['@babel/preset-env', {
          targets: {
            /* 指定 Node.js 的版本 */
            "node": "current",
            browsers: ['> 1%', 'last 2 versions']
          }
        }]
      ]
    }
  },
  /* 排除规则之外 */
  exclude: '/node_modules/'
}
```

## 3-4 由浅入深 webpack - 编译 typescript

- js 超集
- lodash: 封装了诸多对字符串、数组、对象等常见数据类型的处理函数

```console
npm i webpack typescript ts-loader awesome-typescript-loader -D

<!-- 说明文件, 编译出问题能抛出问题 -->
npm i @types/lodash -S
<!-- 选上 -->
npm i loadash -S

<!-- 类型文件管理 -->
npm i typings -g
typings i lodash -S
```

## 3-5, 3-6 由浅入深 webpack - 打包公共代码

- 分割 Chunk, 减少代码冗余, 加快速度
- lodash: 封装了诸多对字符串、数组、对象等常见数据类型的处理函数
- webpack4 删除了 webpack.optimize.CommonsChunkPlugin

```console
npm i webpack -D
npm i lodash -S
```

```js
/* optimization 配置自己的自定义模式 */
/* webpack4 替代 webpack.optimize.CommonsChunkPlugin, 提取公共代码 */
optimization: {
    splitChunks: {
    name: 'vendor',
      chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async",
      minSize: 0, // 最小尺寸，默认0
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 1, // 最大异步请求数， 默认1
      maxInitialRequests : 1, // 最大初始化请求书，默认1
  },
  runtimeChunk: true
}
```

## 3-7, 3-8: 由浅入深 webpack - 代码分割和懒加载

- **src/pageA**
- require.ensure: 动态加载模块, callback 才执行
- require.include: 引入模块(提取引入公共模块))

```js
/* 引入模块, 但不执行, 提前加载第三方模块, 减少加载次数 */
require.include('./moduleA.js')
/* ensure 会把没有使用过的 require 资源进行独立分成成一个js文件 */
require.ensure(['./subPageA.js'], function () {
  /* 真正执行代码 */
  let subPageA = require('./subPageA')
}, 'subPageA')
```

## 3-9, 3-10, 3-11 由浅入深 webpack - 处理 CSS - style-loader

- style-loader: 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里
- css-loader: 打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了

```console
npm i style-loader css-loader file-loader -D
```

```js
{
  /* 在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里 */
  loader: 'style-loader',
  /* 小众功能, 使用 link 标签, 不能处理多个样式 */
  // loader: 'style-loader/url',
  // loader: 'style-loader/useable'
  options: {
    /* insertAt(插入位置) */
    /* insertInto(插入到 dom) */
    /* insertInto: '#app', */
    /* singleton (是否只使用一个 style 标签) */
    singleton: true,
    /* transform 在样式加载器加载到页面之前修改 CSS */
    transform: './css.transform.js'
  }
},
{
  /* 打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了 */
  loader: 'css-loader',
  /* 小众功能, 使用 link 标签, 不能处理多个样式 */
  // loader: 'file-loader'
  options: {
    /* 是否压缩 */
    minimize: true,
    /* 启用 css-modules */
    modules: true,
    /* 定义编译出来的名称 */
    localIdentName: '[path][name]_[local]_[hash:base64:5]'
  }
}
```

## 3-12 由浅入深 webpack - 处理 CSS - 配置 Less - Sass

```console
npm i less-loader less -D
npm i sass-loader console-sass -D
```

```js
{
  /* 放置 css-loader 下面 */
  loader: 'sass-loader'
}
```

## 3-13 由浅入深 webpack - 处理 CSS - 提取 CSS

- bug fix: [https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701](extract-text-webpack-plugin版本没有跟上webpack4导致问题)
- extract-loader

```console
npm install extract-text-webpack-plugin webpack -D
npm i -D extract-text-webpack-plugin@next
```

```js
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
plugins: [
  /* 提取 css */
  new ExtractTextWebpackPlugin({
    /* 提取出来的 css 文件名字 */
    filename: '[name].min.css',
    /* 指定提取 css 范围, 提取初始化 */
    allChunks: false
  })
]
```

```js
use: ExtractTextWebpackPlugin.extract({
  /* 提取出来的文件用什么处理 */
  fallback: {},
  use: [{}]
})
```

## 3-14 由浅入深 webpack - PostCSS-in-webpack

- postcss(js 转换 css, 打包时期)

```console
npm i postcss postcss-loader autoprefixer cssnano postcss-cssnext -D
```

```js
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
      /* 压缩优化 css */
      require('cssnano')()
    ]
  }
},
```

- browserslist(浏览器限制) **package.json**

```json
"browserslist": [
  ">= 1%",
  "last 2 versions"
]
```

## 3-15, 3-16 由浅入深 webpack - Tree-shaking - JS CSS Tree-shaking

- Tree-shaking 没使用到的代码删除掉
- bug fix: [https://github.com/webpack-contrib/uglifyjs-webpack-plugin](webpack.optimize.UglifyJsPlugin版本没有跟上webpack4导致问题) babel-env 出现问题参考 3-3

```console
npm i uglifyjs-webpack-plugin -D
npm i lodash-es -S
npm i babel-loader babel-core babel-preset-env  babel-plugin-lodash -D
<!-- CSS -->
npm i glob-all -D
npm i purifycss-webpack -D
```

```js
/* 放 ExtractTextWebpackPlugin 后面 */
/* 去除多余的 css */
new PurifyCss({
  paths: glob.sync([
    path.join(__dirname, './*.html'),
    path.join(__dirname, './src/*.js')
  ])
}),
/* 对 js 文件进行压缩 */
new UglifyJsPlugin
```

## 4-1, 4-2, 4-3 文件处理（2）- 图片处理 - 压缩图片、自动合成雪碧图 Base64 编码 sprite、retina 处理 处理字体文件

```console
npm i file-loader url-loader img-loader postcss-sprites -D
```

- 1@2x.png retina 屏幕上用的图片

```js
{
  /* 将css3属性添加上厂商前缀 */
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [
      /* 雪碧图 图片合并成一张图 */
      require('postcss-sprites')({
        spritePath: 'dist/assets/imgs/sprites',
        retina: true
      })
    ]
  }
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
      /* base64 */
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
      /* 压缩图片 */
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
  /* 字体文件 */
  test: /\.(eot|woff2?|ttf|svg)$/,
  use: [{
    loader: 'url-loader',
    options: {
      name: '[name]-[hash:5].[ext]',
      /* 超出 5000 处理成 base64 */
      limit: 5000,
      /* 图片地址不对, 设置绝对路径 */
      publicPath: '',
      /* 放到 dist 目录 */
      outputPath: 'dist/',
      /* 设置相对路径 */
      useRelativePath: true
    }
  }]
}
```

## 4-4 文件处理（4）- 处理第三方 JS 库（providePlugin、imports-loader）

```console
npm i jquery -S
npm i imports-loader -D
```

- resolve: 可以找到本地 jquery
- imports-loader
- webpack.ProvidePlugin

```js
/* resolve: 可以找到本地 jquery */
resolve: {
  alias: {
    /* 找到本地的 jquery */
    jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
  }
},
{
  /* 第三方 js 库 */
  test: path.resolve(__dirname, 'src/app.js'),
  use: [{
    loader: 'imports-loader',
    options: {
      $: 'jquery'
    }
  }]
}
/* 第三方 js 库 */
new webpack.ProvidePlugin({
  $: 'jquery'
})
```

## 4-5 html in webpack（1） - 生成 HTML

- HtmlWebpackPlugin

```console
npm i html-webpack-plugin -S
```

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')
/* 生成 HTML */
new HtmlWebpackPlugin({
  /* 输出位置文件 */
  filename: 'index.html',
  /* 模板文件 */
  template: './index.html',
  /* css, js 通过标签形式插入页面中 */
  // inject: false,
  /* 指定有哪些要加入到页面来 */
  chunks: ['app'],
  /* 压缩 */
  minify: {
    collapseWhitespace: true
  }
})
```

## 4-6 html in webpack（2） - HTML 中引入图片

- html-loader

```console
npm i html-loader -S
```

```js
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
```

## 4-7 html in webpack（3） - 配合优化

- bug!
- 提取载入 webpack 加载代码

```console
npm i html-webpack-inline-chunk-plugin -D
```

```js
var HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
/*
它内联您使用HtmlWebpackPlugin编写为链接或脚本的块。
它可用于在脚本标记内嵌入清单以保存http请求，如本示例中所述。 
它不仅限于清单块，而是可以内联任何其他块。
*/
new HtmlInlineChunkPlugin({
  inlineChunks: ['manifest']
})
```
