# webpack

## 3-1 由浅入深 webpack - 使用 webpack

```shell
webpack -h
webpack -v
```

- webpack-cli: 交互式初始化项目, 迁移v1->v2, 目前不完善

```shell
npm install webpack-cli -g
webpack-cli -h
webpack-cli init webpack-addons-demo
```

- 指定webpack文件来启动

```shell
webpack --config webpack.conf.dev.js
```

## 3-2 由浅入深 webpack - 打包 JS

```shell
<!-- 打包 -->
webpack app.js bundle.js
<!-- 调用webpack配置文件 -->
webpack
<!-- 使用自定义webpack名称调用webpack -->
webpack --config webpack-conf.js
```

## 3-3 由浅入深 webpack - 编译 ES6

- Babel Presets: 规范的总结, 指定浏览器, 环境, 为应用开发准备

```shell
npm init
npm install babel-loader babel-core -D
npm install babel-preset-env -D
```

- babel polyfill: 全局垫片, 为应用开发准备, 能写es7, es8等新方法

```shell
npm install babel-polyfill -S
```

- babel runtime transform: 局部垫片, 为开发框架库准备

```shell
npm install babel-plugin-transform-runtime -D
npm install babel-runtime -S
```

- config .babelrc

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
