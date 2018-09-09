/* 引入模块, 但不执行, 提前加载第三方模块, 减少加载次数 */
require.include('./moduleA.js')

let page = 'subPageA'

if (page === 'subPageA') {
  /*
  动态加载模块, 懒加载
  []: dependencies(不执行代码)
  callback(执行代码)
  errorCallback(可省略)
  chunkName
  */
  /* ensure 会把没有使用过的 require 资源进行独立分成成一个js文件 */
  require.ensure(['./subPageA.js'], function () {
    /* 真正执行代码 */
    let subPageA = require('./subPageA')
  }, 'subPageA')
  /* 动态 import 会马上执行代码 */
  // import('./subPageA').then(function (subPageA) {  
  //   console.log(subPageA)
  // })
} else if (page === 'subPageB') {
  /* 动态加载模块, 懒加载 */
  require.ensure(['./subPageB.js'], function () {
    let subPageA = require('./subPageB')
  }, 'subPageB')
}

/* 第三方模块 lodash 与业务代码分离 */
require.ensure(['lodash'], function () {
  /* 真正执行代码 */
  let _ = require('lodash')
  /* 使用 lodash 方法 join() */
  _.join(['1', '2'], 3)
}, 'vendor')

export default 'pageA'