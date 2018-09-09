// import './css/base.css'
// import './css/common.css'


/* style-loader/useable */
import base from './css/base.scss'
// import common from './css/common.scss'

// var flag = false

// setInterval(function () {
//   if (flag) {
//     base.unuse()
//   } else {
//     base.use()
//   }
//   flag = !flag
// }, 500)

var app = document.getElementById('app')
app.innerHTML = '<div class="' + base.box + '"></div>'
