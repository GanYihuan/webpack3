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

```shell
webpack -h
webpack -v
```

- webpack-cli: 交互式初始化项目, 迁移 v1->v2, 目前不完善

```shell
npm install webpack-cli -g
webpack-cli -h
webpack-cli init webpack-addons-demo
```

- 指定 webpack 文件(webpack.conf.dev.js)来启动

```shell
webpack --config webpack.conf.dev.js
```

## 3-2 由浅入深 webpack - 打包 JS

```shell
<!-- 调用webpack配置文件 -->
webpack
<!-- 使用自定义webpack名称调用webpack -->
webpack --config webpack-selfdefind.js
```

## 3-3 由浅入深 webpack - 编译 ES6

- Babel Presets: 规范的总结, 指定浏览器, 环境, 为应用开发准备
- env: 包含所有规范, es2015, es2016, es2017
- babel polyfill: 全局垫片, 能写 es7, es8 等新方法, 为应用开发准备, import 'babel-polyfill', 会污染全局, config .babelrc presets
- babel runtime transform: 局部垫片, 为开发框架库准备, 不会污染全局

```shell
npm init
npm i babel-polyfill -S

npm install babel-loader@8.0.0-beta.0 @babel/core
<!-- 上下二选一,选上 -->
npm i babel-loader babel-core -D

npm i @babel/preset-env -D
<!-- 上下二选一,选上 -->
npm i babel-preset-env -D

npm i @babel/plugin-transform-runtime -D
<!-- 上下二选一,选上 -->
npm i babel-plugin-transform-runtime -D

npm i @babel/runtime -S
<!-- 上下二选一,选上 -->
npm i babel-runtime -S
```

## 3-4 由浅入深 webpack - 编译 typescript

- js 超集

```shell
npm i webpack typescript ts-loader awesome-typescript-loader -D
npm i loadash -S
<!-- 说明文件, 编译出问题能抛出问题 -->
npm i @types/lodash -S
<!-- 类型文件管理, 和上面一样 -->
npm i typings -g
typings i lodash -S
```

## 3-5, 3-6 由浅入深 webpack - 打包公共代码

- 减少代码冗余, 加快速度
- webpack4 删除webpack.optimize.CommonsChunkPlugin

```webpack
// webpack4替代 webpack.optimize.CommonsChunkPlugin
optimization: {
  splitChunks: {
    chunks: 'all'
  },
  runtimeChunk: true
},
```

```shell
npm i webpack -D
npm i lodash -S
```

## 3-7, 3-8: 由浅入深 webpack - 代码分割和懒加载

## 3-9 由浅入深 webpack - 处理 CSS - style-loader

- style-loader: 创建 style 标签, 里面是 css 内容
- css-loader: js import css 进来

```shell
npm i style-loader css-loader file-loader -D
```

- style-loader/url(不常用)
- style-loader/useable(控制样式是否插入页面中)
- style-loader options
  insertAt(插入位置)
  insertInto(插入到 dom)
  singleton(是否只使用一个 style 标签)
  transform(转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式)
- css-loader options
  alias(解析别名)
  importLoader(@import)
  Minimize(是否压缩)
  modules(启动css-modules)
- css-Modules
  :local(局部)
  :global(全局)
  compose(继承)
  compose ... from path(import)

## 3-12 由浅入深 webpack - 处理 CSS - 配置 Less - Sass

- npm i less-loader less -D
- npm i sass-loader node-sass -D

## 3-13 由浅入深 webpack - 处理 CSS - 提取 CSS

- bug fix: [https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701](extract-text-webpack-plugin版本没有跟上webpack4导致问题)
- extract-loader
- npm install extract-text-webpack-plugin webpack -D
- npm i -D extract-text-webpack-plugin@next

## 3-14 由浅入深 webpack - PostCSS-in-webpack

- PostCss(css transforming, 打包时期)
- npm i postcss postcss-loader autoprefixer cssnano postcss-cssnext -D
- autoprefixer(加css各浏览器前缀)
- css-nano(压缩css)
- css-next(使用未来的css语法)

## 3-15 由浅入深 webpack - Tree-shaking - JS Tree-shaking

- bug fix: [https://github.com/webpack-contrib/uglifyjs-webpack-plugin](webpack.optimize.UglifyJsPlugin版本没有跟上webpack4导致问题) babel-env出现问题参考3-3
- npm i -D uglifyjs-webpack-plugin
- npm i lodash-es -S
- npm i babel-loader babel-core babel-preset-env babel-plugin-lodash -D

## 3-16 由浅入深 webpack - Tree-shaking - CSS Tree-shaking

- npm i glob-all -D
- npm i purifycss-webpack -D

## 4-1 文件处理（1）- 图片处理 - CSS中引入图片、Base64编码

- file-loader
- url-loader
- img-loader
- postcss-sprites
