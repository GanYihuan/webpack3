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

var div = document.getElement('div')
div.className = 'smallBox'

app.appendChild(div)

import {
  a
} from './common/util'
console.log(a())

import {
  chunk
} from 'lodash-es'
console.log(chunk([1, 2, 3, 4, 5], 2))