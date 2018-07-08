/* 动态加载模块, 但不执行, 提前加载第三方模块, 减少加载次数 */ 
require.include('./moduleA.js')

var page = 'subPageA'

if (page === 'subPageA') {
  /* 动态加载模块, 懒加载 */
  require.ensure(['./subPageA.js'], function () {
    /* 真正执行代码 */
    var subPageA = require('./subPageA')
  }, 'subPageA')
  /* 动态import会马上执行代码 */
  // import('./subPageA').then(function (subPageA) {  
  //   console.log(subPageA)
  // })
} else if (page === 'subPageB') {
  /* 动态加载模块, 懒加载 */
  require.ensure(['./subPageB.js'], function () {
    var subPageA = require('./subPageB')
  }, 'subPageB')
   /* 动态import会马上执行代码 */
  // import('./subPageB').then(function (subPageB) {  
  //   console.log(subPageB)
  // })
}

/* 第三方模块lodash与业务代码分离 */
/* 动态加载模块, 懒加载 */
require.ensure([], function () {
  /* 真正执行代码 */
  var _ = require('lodash')
  _.join(['1', '2'], 3)
}, 'vendor')

export default 'pageA'
