# webpack

## 3-1 由浅入深 webpack - 使用 webpack

- ✨✨

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

- 指定 webpack 文件来启动

```shell
webpack --config webpack.conf.dev.js
```

## 3-2 由浅入深 webpack - 打包 JS

- ✨✨

```shell
<!-- 调用webpack配置文件 -->
webpack
<!-- 使用自定义webpack名称调用webpack -->
webpack --config webpack-selfdefind.js
```

## 3-3 由浅入深 webpack - 编译 ES6

- ✨✨
- Babel Presets: 规范的总结, 指定浏览器, 环境, 为应用开发准备
- env: 包含所有规范, es2015, es2016, es2017
- babel polyfill: 全局垫片, 能写 es7, es8 等新方法, 为应用开发准备
- babel runtime transform: 局部垫片, 为开发框架库准备

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

- 应用开发(runtime), config .babelrc presets, 不会污染全局
- 开发ui组件库时, import babel-prolyfill

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

```shell
npm i webpack -D
npm i lodash -S
```
