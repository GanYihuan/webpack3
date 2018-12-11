/* style-loader/useable */
import base from './css/base.less'
// import common from './css/common.less'

// var flag = false
// setInterval(function () {
//   if (flag) {
/* style-loader/useable 方法 */
//     base.unuse()
//   } else {
/* style-loader/useable 方法 */
//     base.use()
//   }
//   flag = !flag
// }, 500)

var app = document.getElementById('app')
app.innerHTML = '<div class="' + base.box + '"></div>'