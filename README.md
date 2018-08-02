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

## 3-4 由浅入深 webpack - 编译 typescript

- js 超集

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

- 减少代码冗余, 加快速度
- webpack4 删除了 webpack.optimize.CommonsChunkPlugin

```json
// webpack4 替代 webpack.optimize.CommonsChunkPlugin
optimization: {
  "splitChunks": {
    "chunks": "all",
    // 提取公共代码次数
    "minChunks": "Infinity"
  },
  "runtimeChunk": "true"
}
```

```console
npm i webpack -D
npm i lodash -S
```

## 3-7, 3-8: 由浅入深 webpack - 代码分割和懒加载

- **src/pageA**
- require.ensure 动态加载模块, callback 才执行
- require.include 引入模块(提取引入公共模块))

## 3-9, 3-10, 3-11 由浅入深 webpack - 处理 CSS - style-loader

- style-loader: 创建 style 标签
- css-loader: js import css

```console
npm i style-loader css-loader file-loader -D
```

## 3-12 由浅入深 webpack - 处理 CSS - 配置 Less - Sass

```console
npm i less-loader less -D
npm i sass-loader console-sass -D
```

## 3-13 由浅入深 webpack - 处理 CSS - 提取 CSS

- bug fix: [https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701](extract-text-webpack-plugin版本没有跟上webpack4导致问题)
- extract-loader

```console
npm install extract-text-webpack-plugin webpack -D
npm i -D extract-text-webpack-plugin@next
```

## 3-14 由浅入深 webpack - PostCSS-in-webpack

- postcss(js 转换 css, 打包时期)

```console
npm i postcss postcss-loader autoprefixer cssnano postcss-cssnext -D
```

- autoprefixer(加 css 各浏览器前缀)
- css-nano(压缩 css)
- css-next(使用未来的 css 语法)
- browserslist(浏览器限制) **package.json**

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

## 4-1 文件处理（1）- 图片处理 - CSS 中引入图片、Base64 编码

```console
npm i file-loader url-loader img-loader postcss-sprites -D
```

## 4-2, 4-3 文件处理（2）- 图片处理 - 压缩图片、自动合成雪碧图sprite、retina处理 处理字体文件

- 1@2x.png retina 屏幕上用的图片

## 4-4 文件处理（4）- 处理第三方 JS 库（providePlugin、imports-loader）

```console
npm i jquery -S
npm i imports-loader -D
```

- 如果不 install jquery, resolve 可以找到本地 jquery

## 4-5 html in webpack（1） - 生成 HTML

- HtmlWebpackPlugin

```console
npm i html-webpack-plugin -S
```

## 4-6 html in webpack（2） - HTML 中引入图片

- html-loader

```console
npm i html-loader -S
```

## 4-7 html in webpack（3） - 配合优化

- bug!
- 提取载入 webpack 加载代码

```console
npm i html-webpack-inline-chunk-plugin -D
```