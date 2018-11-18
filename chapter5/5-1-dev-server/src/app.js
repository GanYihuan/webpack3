// import './css/base.css'
// import './css/common.css'

/* style-loader/useable */
import { a } from './common/util'
import base from './css/base.scss'
import * as _ from 'lodash'
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

console.log(a())

// import { chunk } from 'lodash-es'
// console.log(chunk([1, 2, 3, 4, 5], 2))

/* eslint-disable no-undef */
$('div').addClass('new')
$.get(
	'https://m.weibo.cn/api/comments/show',
	{
		id: '4193586758833502',
		page: 1
	},
	function(data) {
		console.log(data)
	}
)
$.get(
	'/msg/index',
	{
		format: 'cards'
	},
	function(data) {
		console.log(data)
	}
)

if (module.hot) {
  // need hot refresh
	module.hot.accept()
}
